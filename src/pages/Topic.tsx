import { useState } from 'react'
import {
  useParams
  // , useNavigate
} from 'react-router-dom'
import { useFireproof } from 'use-fireproof'
import { Items } from '../components/Items'
import { InlineEditor } from '../components/InlineEditor'
import { MagneticPoem } from '../components/MagneticPoem'

export type TopicDoc = {
  _id?: string
  title: string
  description?: string
  created: number
  updated: number
  type: 'topic'
}

export function Topic() {
  // const navigate = useNavigate() // Initialize useHistory hook
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)

  const { database, useLiveQuery } = useFireproof('topics')
  const { id } = useParams()

  const topics = useLiveQuery('_id', { key: id })
  const [topic] = topics.docs as TopicDoc[]

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        {isEditingTitle ? (
          <InlineEditor
            field="title"
            topic={topic}
            database={database}
            isEditing={isEditingTitle}
            setIsEditing={setIsEditingTitle}
          />
        ) : (
          <h1 className="text-2xl font-bold" onClick={() => setIsEditingTitle(true)}>
            {topic?.title}
          </h1>
        )}
      </div>
      <div className="mb-2">
        <span className="text-sm text-gray-500">
          Created: {new Date(topic?.created).toLocaleString()}
        </span>
        <span className="ml-4 text-sm text-gray-500">
          Updated: {new Date(topic?.updated).toLocaleString()}
        </span>
      </div>
      <InlineEditor
        field="description"
        label="Edit Description: "
        topic={topic}
        database={database}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />

      <MagneticPoem></MagneticPoem>

      <Items topicId={id!} />
    </div>
  )
}
