'use client'

import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.landingContainer}>
      <div className={styles.stars}></div>
      <div className={styles.content}>
        <h1 className={styles.mainTitle}>
          <span className={styles.glitch} data-text="Say Yes Please">
            Say Yes Please
          </span>
        </h1>
        
        <p className={styles.subtitle}>
          Create a fun, interactive button that makes saying "No" impossible! 
          Perfect for proposals, invitations, or just having fun with friends.
        </p>
        
        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🎨</div>
            <h3>Fully Customizable</h3>
            <p>Add names, questions, themes, and button text</p>
          </div>
          
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🎯</div>
            <h3>Interactive Game</h3>
            <p>The "No" button moves away when you try to click it!</p>
          </div>
          
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🎉</div>
            <h3>Celebration Effects</h3>
            <p>Beautiful animations when they say "Yes"</p>
          </div>
        </div>
        
        <Link href="/create" className={styles.ctaButton}>
          Create Your Custom Button
        </Link>
        
        <div className={styles.examples}>
          <p className={styles.examplesTitle}>Perfect for:</p>
          <div className={styles.examplesList}>
            <span>💕 Valentine Proposals</span>
            <span>👫 Friend Invitations</span>
            <span>🎂 Birthday Parties</span>
            <span>💍 Special Moments</span>
          </div>
        </div>
      </div>
    </div>
  )
}
