import React, { useEffect, useState } from 'react'
import { db, storage } from 'fbase'
import { doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../styles/tweet.scss'

function Tweet({ tweetObj, isOwner }) {
  const [editing, setEditing] = useState(false)
  const [newTweet, setNewTweet] = useState(tweetObj.text)
  const [nowDate, setNowDate] = useState(tweetObj.createAt)

  const onDeletClick = async () => {
    const ok = window.confirm('삭제하시겟습니까?')
    if (ok) {
      console.log(tweetObj.id)
      // const data = await db.doc(`tweets/${tweetObj.id}`);
      const data = await deleteDoc(doc(db, 'tweets', `/${tweetObj.id}`))
      // 문자열에 변수값이 들어가야할때는 ``를 사용한다.
      // /${tweetObj.createId}  : / 폴더 밑의 문서
      // console.log(data);
      if (tweetObj.attachmentUrl !== '') {
        const deleteRef = ref(storage, tweetObj.attachmentUrl)
        await deleteObject(deleteRef)
      }
    }
  }

  const toggleEditing = () => {
    setEditing(prev => !prev)
  }

  const onChange = e => {
    // console.log(e.target.value);
    const {
      target: { value },
    } = e
    setNewTweet(value)
  }

  const onSubmit = async e => {
    e.preventDefault()
    console.log(tweetObj.id, newTweet)
    const newTweetRef = doc(db, 'tweets', `/${tweetObj.id}`)
    await updateDoc(newTweetRef, {
      text: newTweet,
      createAt: Date.now(),
    })
    setEditing(false)
  }

  useEffect(() => {
    let timeStamp = tweetObj.createAt
    const now = new Date(timeStamp)
    //console.log(now);
    setNowDate(now.toUTCString()) //.toUTCString() .toDateString()
  }, [])
  // 현재시간 보이게 하는

  return (
    <div className="tweet">
      {editing ? ( //수정화면
        <>
          <form onSubmit={onSubmit} className="container tweetEdit">
            <input
              onChange={onChange}
              value={newTweet}
              required
              className="formInput"
            />
            <input type="submit" value="update Tweet" />
          </form>
          <button onClick={toggleEditing} className="formBtn cancleBtn">
            Cancle
          </button>
        </>
      ) : (
        <>
          <h4>{tweetObj.text}</h4>
          {tweetObj.attachmentUrl && (
            <img src={tweetObj.attachmentUrl} width="50" height="50" />
          )}
          <span className="date">{nowDate}</span>
          {isOwner && (
            <div className="tweet__actions">
              <span onClick={onDeletClick}>
                <FontAwesomeIcon icon="fa-solid fa-trash" />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon="fa-solid fa-pencil" />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
//로그인한 계정에만 데이터 삭제와 수정버튼을 만든다

export default Tweet
