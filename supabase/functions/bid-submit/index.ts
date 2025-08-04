import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the session
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (req.method === 'POST') {
      const { product_id, price, qty_kg } = await req.json()

      // Validate input
      if (!product_id || !price || !qty_kg) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      // Check if product exists and is active
      const { data: product, error: productError } = await supabaseClient
        .from('products')
        .select('id, title, min_price, farmer_id')
        .eq('id', product_id)
        .eq('status', 'active')
        .single()

      if (productError || !product) {
        return new Response(
          JSON.stringify({ error: 'Product not found or not active' }),
          { 
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      // Check if bid price meets minimum
      if (price < product.min_price) {
        return new Response(
          JSON.stringify({ error: 'Bid price below minimum' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      // Create the bid
      const { data: bid, error: bidError } = await supabaseClient
        .from('bids')
        .insert({
          product_id,
          buyer_id: user.id,
          price,
          qty_kg,
          status: 'pending'
        })
        .select()
        .single()

      if (bidError) {
        console.error('Bid creation error:', bidError)
        return new Response(
          JSON.stringify({ error: 'Failed to create bid' }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      // Create notification for farmer
      await supabaseClient
        .from('notifications')
        .insert({
          user_id: product.farmer_id,
          type: 'bid',
          payload: {
            bid_id: bid.id,
            product_title: product.title,
            price,
            qty_kg
          }
        })

      return new Response(
        JSON.stringify({ data: bid }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})