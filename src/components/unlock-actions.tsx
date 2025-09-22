'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ExternalLink, Copy, CheckCircle, Download } from 'lucide-react'

interface UnlockActionsProps {
  list: {
    id: string
    title: string
    mapsListUrl: string
    hostedMirror: boolean
  }
}

export function UnlockActions({ list }: UnlockActionsProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const openInGoogleMaps = () => {
    window.open(list.mapsListUrl, '_blank')
  }

  return (
    <div className="space-y-4">
      {/* Primary Action - Open in Google Maps */}
      <Button
        onClick={openInGoogleMaps}
        className="w-full"
        size="lg"
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Open in Google Maps
      </Button>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => copyToClipboard(list.mapsListUrl)}
          className="flex items-center justify-center"
        >
          {copied ? (
            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {copied ? 'Copied!' : 'Copy Link'}
        </Button>

        {list.hostedMirror && (
          <Button
            variant="outline"
            onClick={() => {
              // This would open the hosted mirror view
              console.log('Open hosted mirror')
            }}
            className="flex items-center justify-center"
          >
            <Download className="h-4 w-4 mr-2" />
            View Map
          </Button>
        )}
      </div>

      {/* Instructions */}
      <div className="p-3 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Tip:</strong>{' '}
          {"After opening in Google Maps, click the \"Follow\" button to save this list to your Google account for easy access later."}
        </p>
      </div>
    </div>
  )
}
