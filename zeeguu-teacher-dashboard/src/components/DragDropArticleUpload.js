import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import Dropzone from 'react-dropzone'

import { MdCloudUpload } from 'react-icons/md/'

import { uploadArticles } from '../api/apiArticles'
import { articleContentReader } from '../helpers/articleUploadHelpers'
import { createArticleObject } from '../helpers/articleUploadHelpers'

import { languageMap } from '../helpers/sharedHelperMaps'


export const DragDropArticleUpload = ({ user, cohortData, setForceRerender }) => {
    const languageCode = languageMap[cohortData.language_name]
    const [articlesToUpload, setArticlesToUpload] = useState([])
    
    const prepareArticles = articles => {
        const articlesData = articles.map(async article => {
          const content = await articleContentReader(article)
          const object = createArticleObject(
            article.name,
            content,
            languageCode,
            user
          )
          return object
        })
        Promise.all(articlesData).then(data => {
          setArticlesToUpload(data)
        })
      }
    
      const onUploadArticles = e => {
        e.preventDefault()
        uploadArticles(cohortData.id, articlesToUpload).then(result => {
          setForceRerender(prev => prev + 1)
          setArticlesToUpload([])
        })
      }


    return(
        <div style={{ marginBottom: '20px' }}>
        <Dropzone
          accept={['.txt']}
          onDrop={acceptedArticles => prepareArticles(acceptedArticles)}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="drop-articles">
                  {articlesToUpload.length ? (
                    <ul>
                      {articlesToUpload.map(article => (
                        <li key={article.title}>{article.title}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>
                      Drag and drop file here, or click to select file
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}
        </Dropzone>
        {articlesToUpload.length ? (
          <Button
            onClick={onUploadArticles}
            variant="contained"
            color="default"
            style={{ marginTop: 10 }}
          >
            Upload article
            <MdCloudUpload style={{ marginLeft: '10px' }} />
          </Button>
        ) : null}
      </div>
    )
}
