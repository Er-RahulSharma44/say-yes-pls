'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { encodeGameData } from '../utils/encode'
import styles from './page.module.css'

export default function CreatePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    question: 'Will be my valentine?',
    theme: 'love',
    yesText: 'Yes!',
    noText: 'No'
  })
  const [shareLink, setShareLink] = useState('')
  const [showShare, setShowShare] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Encode all data into a single short parameter
    const encoded = encodeGameData(formData)
    // Use hash routing for even shorter URLs
    const link = `${window.location.origin}/g#${encoded}`
    setShareLink(link)
    setShowShare(true)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
    alert('Link copied to clipboard!')
  }

  return (
    <div className={styles.container}>
      <div className={styles.stars}></div>
      <div className={styles.contentBox}>
        <h1 className={styles.glitch} data-text="Create Your Custom Button">
          Create Your Custom Button
        </h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Their Name:</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter their name (e.g., Priya)"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="question">Question Text:</label>
            <input
              type="text"
              id="question"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Will be my valentine?"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="theme">Theme:</label>
            <select
              id="theme"
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              required
            >
              <option value="love">💕 Love</option>
              <option value="friends">👫 Friends</option>
              <option value="funny">😂 Funny</option>
              <option value="romantic">🌹 Romantic</option>
              <option value="cute">🐱 Cute</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="yes-text">Yes Button Text:</label>
            <input
              type="text"
              id="yes-text"
              value={formData.yesText}
              onChange={(e) => setFormData({ ...formData, yesText: e.target.value })}
              placeholder="Yes!"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="no-text">No Button Text:</label>
            <input
              type="text"
              id="no-text"
              value={formData.noText}
              onChange={(e) => setFormData({ ...formData, noText: e.target.value })}
              placeholder="No"
              required
            />
          </div>
          
          <button type="submit" className={styles.btnPrimary}>
            Create & Get Link
          </button>
        </form>
        
        {showShare && (
          <div className={styles.shareSection}>
            <div className={styles.shareBox}>
              <h3>Your Link is Ready! 🎉</h3>
              <div className={styles.linkContainer}>
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className={styles.shareLink}
                />
                <button onClick={copyToClipboard} className={styles.btnCopy}>
                  Copy Link
                </button>
              </div>
              <p className={styles.shareHint}>
                Share this link with your special someone!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

