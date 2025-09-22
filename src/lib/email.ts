import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendUnlockEmail(email: string, unlockUrl: string, listTitle: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Delish <noreply@delish.app>',
      to: [email],
      subject: `Your ${listTitle} is ready to unlock!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Your map is ready! 🗺️</h1>
          <p>Thank you for your purchase! You can now access your curated map.</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0;">${listTitle}</h2>
            <a href="${unlockUrl}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Unlock Your Map
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 10 minutes for security. If you need to access your map again, 
            you can request a new link from the purchase page.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Failed to send unlock email:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error sending unlock email:', error)
    return false
  }
}

export async function sendMagicLinkEmail(email: string, magicLink: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Delish <noreply@delish.app>',
      to: [email],
      subject: 'Access your purchased maps',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Access Your Maps</h1>
          <p>Click the link below to access your purchased maps:</p>
          <a href="${magicLink}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Access Your Maps
          </a>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 1 hour for security.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Failed to send magic link email:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error sending magic link email:', error)
    return false
  }
}

