import React, { useEffect, useRef } from 'react'

import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Quote from '@editorjs/quote'
import ImageTool from '@editorjs/image'
import Embed from '@editorjs/embed'
import Paragraph from '@editorjs/paragraph'
import Marker from '@editorjs/marker'
// import Underline from '@editorjs/underline'

const EditorJSComponent = ({ data, onChange }) => {
  const editorRef = useRef(null)

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder: 'editorjs',

        autofocus: true,

        data: data || {},

        tools: {
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },

          h1: {
            class: Header,
            inlineToolbar: true,
            toolbox: {
              title: 'Header 1',
            },
            config: {
              placeholder: 'Heading 1',
              levels: [1],
              defaultLevel: 1,
            },
          },

          h2: {
            class: Header,
            inlineToolbar: true,
            toolbox: {
              title: 'Header 2',
            },
            config: {
              placeholder: 'Heading 2',
              levels: [2],
              defaultLevel: 2,
            },
          },

          h3: {
            class: Header,
            inlineToolbar: true,
            toolbox: {
              title: 'Header 3',
            },
            config: {
              placeholder: 'Heading 3',
              levels: [3],
              defaultLevel: 3,
            },
          },

          h4: {
            class: Header,
            inlineToolbar: true,
            toolbox: {
              title: 'Header 4',
            },
            config: {
              placeholder: 'Heading 4',
              levels: [4],
              defaultLevel: 4,
            },
          },

          h5: {
            class: Header,
            inlineToolbar: true,
            toolbox: {
              title: 'Header 5',
            },
            config: {
              placeholder: 'Heading 5',
              levels: [5],
              defaultLevel: 5,
            },
          },

          h6: {
            class: Header,
            inlineToolbar: true,
            toolbox: {
              title: 'Header 6',
            },
            config: {
              placeholder: 'Heading 6',
              levels: [6],
              defaultLevel: 6,
            },
          },

          list: {
            class: List,
            inlineToolbar: true,
          },

          quote: {
            class: Quote,
            inlineToolbar: true,
          },

          embed: {
            class: Embed,
            inlineToolbar: true,
          },

          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile(file) {
                  return new Promise((resolve) => {
                    const url = URL.createObjectURL(file)

                    resolve({
                      success: 1,
                      file: { url },
                    })
                  })
                },
              },
            },
          },

          list: {
            class: List,
            inlineToolbar: true,
          },

          marker: {
            class: Marker,
            shortcut: 'CMD+SHIFT+M',
          },

          // underline: Underline,

          quote: {
            class: Quote,
            inlineToolbar: true,

            config: {
              quotePlaceholder: 'Enter Quote',
              captionPlaceholder: 'Quote Author',
            },
          },

          embed: {
            class: Embed,
            inlineToolbar: true,
          },

          image: {
            class: ImageTool,

            config: {
              uploader: {
                uploadByFile(file) {
                  return new Promise((resolve) => {
                    const url = URL.createObjectURL(file)

                    resolve({
                      success: 1,

                      file: {
                        url,
                      },
                    })
                  })
                },
              },
            },
          },
        },

        onChange: async () => {
          const output = await editorRef.current.save()

          onChange(output)
        },
      })
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy()
        editorRef.current = null
      }
    }
  }, [])

  return (
    <div
      id="editorjs"
      className="min-h-[500px] rounded-xl border border-gray-300 bg-white p-4 shadow-sm"
    />
  )
}

export default EditorJSComponent
