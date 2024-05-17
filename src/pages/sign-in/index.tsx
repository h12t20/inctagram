import React from 'react'

import { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useSelector } from 'react-redux'

import { SignInForm } from '@/features/auth-register'
import { MessengerApp } from '@/module-federation/imports'
import { selectIsLoggedIn } from '@/shared/api'
import { RoutersPath } from '@/shared/constants/paths'
import { getLayout } from '@/shared/layouts/main-layout/main-layout'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  if (locale === undefined) throw new Error()

  return {
    props: {
      ...(await serverSideTranslations(locale, 'common')),
    },
  }
}

const SignInPage = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const router = useRouter()

  if (isLoggedIn) {
    router.push(RoutersPath.profile)
  }

  return (
    <>
      <SignInForm />
      <MessengerApp />
    </>
  )
}

SignInPage.getLayout = getLayout
export default SignInPage
