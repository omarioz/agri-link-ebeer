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
      const { bid_id, action } = await req.json()

      if (!bid_id || !action || !['accept', 'reject'].includes(action)) {
        return new Response(
          JSON.stringify({ error: 'Invalid bid_id or action' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      // Get bid with product info
      const { data: bid, error: bidError } = await supabaseClient
        .from('bids')
        .select(`
          *,
          products!inner(farmer_id, title)
        `)
        .eq('id', bid_id)
        .eq('status', 'pending')
        .single()

      if (bidError || !bid) {
        return new Response(
          JSON.stringify({ error: 'Bid not found' }),
          { 
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      // Check if user is the farmer who owns the product
      if (bid.products.farmer_id !== user.id) {
        return new Response(
          JSON.stringify({ error: 'Not authorized to respond to this bid' }),
          { 
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      const newStatus = action === 'accept' ? 'accepted' : 'rejected'

      // Update bid status
      const { error: updateError } = await supabaseClient
        .from('bids')
        .update({ status: newStatus })
        .eq('id', bid_id)

      if (updateError) {
        console.error('Bid update error:', updateError)
        return new Response(
          JSON.stringify({ error: 'Failed to update bid' }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      // If accepted, create an order
      if (action === 'accept') {
        const { data: order, error: orderError } = await supabaseClient
          .from('orders')
          .insert({
            bid_id: bid_id,
            status: 'ordered'
          })
          .select()
          .single()

        if (orderError) {
          console.error('Order creation error:', orderError)
          return new Response(
            JSON.stringify({ error: 'Failed to create order' }),
            { 
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

        // Update product status to sold
        await supabaseClient
          .from('products')
          .update({ status: 'sold' })
          .eq('id', bid.product_id)
      }

      // Create notification for buyer
      await supabaseClient
        .from('notifications')
        .insert({
          user_id: bid.buyer_id,
          type: 'bid',
          payload: {
            bid_id: bid_id,
            product_title: bid.products.title,
            status: newStatus,
            price: bid.price
          }
        })

      return new Response(
        JSON.stringify({ success: true, status: newStatus }),
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