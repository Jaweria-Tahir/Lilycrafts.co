import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import nodemailer from "npm:nodemailer@6.9.9"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const data = await req.json()
    const { eventType } = data

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: Deno.env.get("GMAIL_USER"),
        pass: Deno.env.get("GMAIL_PASSWORD"),
      },
    })

    const fromEmail = Deno.env.get("GMAIL_USER") || "lilycraftco@gmail.com"
    const adminEmail = "lilycraftco@gmail.com"

    if (eventType === 'ORDER_PLACED') {
      const { customerName, customerEmail, orderNumber, totalPrice, phone, address } = data
      
      // Customer
      await transporter.sendMail({
        from: fromEmail,
        to: customerEmail,
        subject: `Order Confirmation - ${orderNumber}`,
        text: `Hi ${customerName},\n\nYour order ${orderNumber} has been successfully placed!\nTotal: Rs. ${totalPrice}\n\nThank you for shopping with Lilycrafts.co!`,
      })

      // Admin
      await transporter.sendMail({
        from: fromEmail,
        to: adminEmail,
        subject: `[NEW ORDER] ${orderNumber}`,
        text: `You have received a new order from ${customerName} (${customerEmail})\nPhone: ${phone}\nAddress: ${address}\nTotal: Rs. ${totalPrice}`,
      })
    } else if (eventType === 'ORDER_CANCELLED') {
      const { customerName, customerEmail, orderNumber, reason } = data
      
      await transporter.sendMail({
        from: fromEmail,
        to: customerEmail,
        subject: `Order Cancelled - ${orderNumber}`,
        text: `Hi ${customerName},\n\nYour order ${orderNumber} has been cancelled.\nReason: ${reason || 'Not provided'}\n\nIf this was a mistake, or if you have any questions, please reply to this email.`,
      })

      await transporter.sendMail({
        from: fromEmail,
        to: adminEmail,
        subject: `[ORDER CANCELLED] ${orderNumber}`,
        text: `Order ${orderNumber} was cancelled by ${customerName} (${customerEmail}).\nReason: ${reason || 'None'}`,
      })
    } else if (eventType === 'ORDER_DELETED') {
      const { customerName, customerEmail, orderNumber } = data
      
      await transporter.sendMail({
        from: fromEmail,
        to: adminEmail,
        subject: `[ORDER DELETED] ${orderNumber}`,
        text: `An admin deleted the order ${orderNumber} associated with customer ${customerName} (${customerEmail}).`,
      })
    }

    return new Response(
      JSON.stringify({ success: true, message: "Emails sent successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  } catch (error) {
    console.error('Email Edge Function Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  }
})
