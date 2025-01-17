import React, { useState } from 'react'

import { GetStaticProps } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast, Toaster } from 'react-hot-toast'

import styles from './expired-verification-link.module.scss'

import { useResendVerificationLinkMutation } from '@/shared/api/services/auth/auth.api'
import { ResendVerificationLinkType } from '@/shared/api/services/auth/auth.api.types'
import broResend from '@/shared/assets/icons/login/bro-resend.svg'
import { getLayout } from '@/shared/layouts/main-layout/main-layout'
import { ShortLangs } from '@/shared/types/lang-switcher-types'
import { Modal, CircularLoader, Button, ButtonSize, ButtonTheme, FormContainer } from '@/shared/ui'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  if (locale === undefined) throw new Error()

  return {
    props: {
      ...(await serverSideTranslations(locale, 'common')),
    },
  }
}

const ExpiredVerificationLinkPage = () => {
  const { t, i18n } = useTranslation('common', { keyPrefix: 'Auth' })

  const [resendNewVerificationLink, { isLoading }] = useResendVerificationLinkMutation()
  const [resendVerificationLinkSuccess, setResendVerificationLinkSuccess] = useState(false)
  const callBackCloseWindow = () => setResendVerificationLinkSuccess(false)

  const router = useRouter()
  const { query } = router
  const { email, baseUrl } = query as ResendVerificationLinkType

  const { handleSubmit } = useForm<ResendVerificationLinkType>({
    mode: 'onChange',
    defaultValues: {
      email: email,
      baseUrl: baseUrl,
    },
  })
  const onSubmit: SubmitHandler<ResendVerificationLinkType> = (
    data: ResendVerificationLinkType
  ) => {
    resendNewVerificationLink(data)
      .unwrap()
      .then(() => {
        setResendVerificationLinkSuccess(true)
      })
      .catch(error => toast.error(error.data.messages[0].message))
  }

  return (
    <>
      <Toaster position="top-right" />
      {resendVerificationLinkSuccess && (
        <Modal title={t('NewLinkSent')} mainButton={'OK'} callBackCloseWindow={callBackCloseWindow}>
          <p>{t('NewLinkHaveSentEmail')}</p>
        </Modal>
      )}
      {isLoading && <CircularLoader />}
      <div className={styles.expired}>
        <FormContainer
          className={styles.expiredContainer}
          title={t('EmailVerificationExpired')}
          // style={
          //   i18n.language === ShortLangs.RU ? { marginBottom: '0', fontSize: '1rem' } : undefined
          // }
        >
          <p>{t('LookLikeVerification')}</p>
          <div className={styles.linkAndImageContainer}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Button theme={ButtonTheme.FILLED} size={ButtonSize.LARGE}>
                {t('ResendVerificationLink')}
              </Button>
            </form>
            <div className={styles.image}>
              <Image src={broResend} alt={'man waits and looks at clock'} />
            </div>
          </div>
        </FormContainer>
      </div>
    </>
  )
}

ExpiredVerificationLinkPage.getLayout = getLayout
export default ExpiredVerificationLinkPage
