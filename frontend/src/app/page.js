'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [topics, setTopics] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchTopics = async () => {
      const res = await fetch('/api/topics')
      const data = await res.json()
      setTopics(data.topics || [])
    }
    fetchTopics()
  }, [])

  return (
    <div className="flex flex-wrap gap-6 justify-center p-6">
      {topics.map((topic) => (
        <div key={topic} className="card w-96 bg-base-100 card-xl shadow-sm">
          <div className="card-body">
            <h2 className="card-title">{topic}</h2>
            <p>Subscribe to read messages from this topic.</p>
            <div className="justify-end card-actions">
              <button
                className="btn btn-primary"
                onClick={() => router.push(`/message?topic=${topic}`)}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
