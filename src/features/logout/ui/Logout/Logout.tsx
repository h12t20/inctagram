import React, { useState } from 'react'

import { CircularProgress } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'

import style from './Logout.module.scss'

import { useLogoutMutation, useMeQuery } from '@/shared/api'
import logoutImg from '@/shared/assets/icons/logout/logout.svg'
import { Button, ButtonTheme } from '@/shared/ui/Button/Button'
import { Modal } from '@/shared/ui/Modal/Modal'

export const Logout = () => {
  const router = useRouter()

  const [logout, { isFetching }] = useLogoutMutation()
  const { data: userData } = useMeQuery()

  const logoutApiHandler = () => {
    logout()
      .unwrap()
      .then(() => {
        router.push('/sign-in')
      })
      .finally(() => {
        closeModal()
      })
  }

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  if (isFetching) {
    return <CircularProgress />
  }

  return (
    <>
      <Button className={style.logoutButton} onClick={openModal} theme={ButtonTheme.FILLED}>
        <Image src={logoutImg} alt={''} />
        <span className={style.description}>Logout</span>
      </Button>
      {isModalOpen && (
        <Modal
          title={'Log Out'}
          extraButton={'Yes'}
          mainButton={'No'}
          callBackCloseWindow={closeModal}
          extraButtonCB={logoutApiHandler}
        >
          Are you really want to log out of your account
          <span className={style.userName}>{userData.email}</span> ?
        </Modal>
      )}
    </>
  )
}
