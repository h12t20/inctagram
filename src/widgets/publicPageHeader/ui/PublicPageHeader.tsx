'use client'
import React from 'react'

import { GetStaticProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

import s from './PublicPageHeader.module.scss'

import styles from '@/features/auth-register/ui/forgotPassForm/ForgotPassForm.module.scss'
import { RoutersPath } from '@/shared/constants/paths'
import { Button, ButtonSize, ButtonTheme } from '@/shared/ui'
import { LanguageSelect } from '@/widgets/langSwitcher'

// export const getStaticProps: GetStaticProps = async ({ locale }) => {
//   if (locale === undefined) throw new Error()
//
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, 'common')),
//     },
//   }
// }

export const PublicPageHeader = () => {
  const { t } = useTranslation('common', { keyPrefix: 'Auth' })

  return (
    <header className={s.header}>
      <Link href="/" className={s.logo}>
        Instagram
      </Link>
      <div className={s.headerRightSide}>
        <div className={s.langSwitcherContainer}>
          <LanguageSelect />
        </div>
        <div className={s.headerBtns}>
          <Link href={RoutersPath.signIn}>
            <Button size={ButtonSize.CLEAN} theme={ButtonTheme.CLEAR}>
              {/*{t('SignIn')}*/}
              SignIn
            </Button>
          </Link>
          <Link href={RoutersPath.signUp}>
            <Button size={ButtonSize.CLEAN}>
              {/*{t('SignUp')}*/}
              SignUp
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
