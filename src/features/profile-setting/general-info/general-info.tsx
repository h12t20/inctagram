import { useEffect, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { Controller, FieldErrors, useForm } from 'react-hook-form'
import { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'

import { AutocompletionOfCities } from './autocompletion-of-cities/autocompletion-of-cities'
import styles from './general-info.module.scss'

import { schema } from '@/features/profile-setting/general-info/yup-schema/schema'
import { ProfilePhoto } from '@/features/profile-setting/ui/profile-photo/profile-photo'
import { ProfileUserType } from '@/shared/api/services/profile/profile.api.types'
import { RoutersPath } from '@/shared/constants/paths'
import { useChangeRoute } from '@/shared/hooks/general-info-page/use-change-route'
import { useFormCache } from '@/shared/hooks/general-info-page/use-form-cache'
import { useServerRequest } from '@/shared/hooks/general-info-page/use-server-request'
import { setGeneralInfo } from '@/shared/providers/store-provider/slices/profile-settings/general-info-reducer'
import { Modal, LinearLoader, Button } from '@/shared/ui'
import { ControlledTextField } from '@/shared/ui/controlled/controlled-textfield/controlled-text-field'
import { Calendar } from '@/widgets/calendar/ui/calendar'

export const GeneralInfo = () => {
  const router = useRouter()

  const {
    t,
    i18n: { t: tRoot },
  } = useTranslation('common', { keyPrefix: 'ProfileSettings' })
  const { t: tError } = useTranslation('common', { keyPrefix: 'Error' })

  const [photo, setPhoto] = useState<Blob | null>(null)
  const [isDeleteAvatar, setIsDeleteAvatar] = useState(false)
  const [isModal, setIsModal] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [forwardURL, setForwardURL] = useState('')
  const [isLeftPage, setIsLeftPage] = useState(false)
  const [isFormChanged, setIsFormChanged] = useState(false)

  const dispatch = useDispatch()

  const {
    profileData,
    updateProfile,
    updateAvatar,
    deleteAvatar,
    currentIsLoading,
    isLoadingProfileData,
    currentErrorHandler,
  } = useServerRequest({
    translate: {
      notAuthorization: tError('NotAuthorization'),
      serverNotAvailable: tError('ServerNotAvailable'),
      networkError: tError('NetworkError'),
    },
  })

  const schemaGeneralInfo = schema({
    translate: {
      minCharacters6: tError('MinCharacters6'),
      maxCharacters30: tError('MaxCharacters30'),
      minCharacters1: tError('MinCharacters1'),
      minCharacters2: tError('MinCharacters2'),
      maxCharacters50: tError('MaxCharacters50'),
      maxCharacters200: tError('MaxCharacters200'),
      requiredField: tError('RequiredField'),
      userNameValidationError: tError('UserNameValidationError'),
      startLatterNotSpecial: tError('StartLatterNotSpecial'),
      minAge: tError('MinAge'),
    },
  })

  const {
    control,
    reset,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isDirty },
  } = useForm<ProfileUserType | any>({
    mode: 'onChange',
    resolver: yupResolver(schemaGeneralInfo),
    defaultValues: {
      userName: '',
      firstName: '',
      lastName: '',
      city: '',
      dateOfBirth: '',
      aboutMe: '',
    },
  })
  const { formCache, cacheForm } = useFormCache({
    getValues,
    setIsFormChanged,
    photo,
    profileData,
  })

  useEffect(() => {
    if (formCache) {
      reset(formCache)
    } else if (profileData) {
      reset(profileData)
    }
  }, [isLoadingProfileData, profileData])

  useEffect(() => {
    const checkValidation = async () => {
      await trigger()
    }

    if (profileData || formCache) {
      checkValidation()
    }
  }, [trigger])

  useChangeRoute({
    router,
    isDirty,
    isLeftPage,
    isFormChanged,
    formCache,
    setIsModal,
    setForwardURL,
  })

  const settingsSaved = () => {
    setIsModal(true)
    setIsSaved(true)
    setIsFormChanged(false)
  }

  const handleUpdateAvatar = () => {
    if (isDeleteAvatar) {
      deleteAvatar()
        .unwrap()
        .then(() => {
          settingsSaved()
        })
        .catch(error => currentErrorHandler(error))
    } else if (photo) {
      const formData = new FormData()

      formData.set('file', photo as Blob)
      updateAvatar(formData)
        .unwrap()
        .then(() => {
          settingsSaved()
        })
        .catch(error => currentErrorHandler(error))
    } else {
      settingsSaved()
    }
  }

  const handleLeftPageWithoutSave = () => {
    dispatch(setGeneralInfo(''))
    setIsLeftPage(true)
    setIsModal(false)
    router.push(forwardURL)
  }
  const handleCloseModal = () => {
    setIsModal(false)
    setIsSaved(false)
  }
  const handleDeleteAvatar = (data: boolean) => {
    setIsDeleteAvatar(data)
    setIsFormChanged(true)
  }
  const handleChangedAvatar = (data: Blob) => {
    setPhoto(data as Blob)
    setIsFormChanged(true)
  }

  const onSubmit = (data: ProfileUserType) => {
    updateProfile(data)
      .unwrap()
      .then(() => {
        handleUpdateAvatar()
      })
      .then(() => {
        dispatch(setGeneralInfo(''))
      })
      .catch(error => currentErrorHandler(error))
  }

  return (
    <div className={styles.generalInfoContainer}>
      {currentIsLoading && <LinearLoader />}
      <Toaster position="top-right" />

      {!!profileData && (
        <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.content}>
            <div className={styles.photoContent}>
              <Controller
                name="avatars"
                control={control}
                render={({ field: { ref, value, ...args } }) => (
                  <ProfilePhoto
                    outsideOnChange={data => handleChangedAvatar(data)}
                    deleteAvatar={data => handleDeleteAvatar(data)}
                    value={formCache ? formCache.avatars : profileData.avatars}
                    {...args}
                  />
                )}
              />
            </div>
            <div className={styles.textFieldsContent}>
              <div className={styles.textContainer}>
                <ControlledTextField
                  label={t('UserName')}
                  name="userName"
                  control={control}
                  required
                />
                <ControlledTextField
                  label={t('FirstName')}
                  name="firstName"
                  control={control}
                  required
                />
                <ControlledTextField
                  label={t('LastName')}
                  name="lastName"
                  control={control}
                  required
                />
              </div>
              <Controller
                name="city"
                control={control}
                render={({ field: { ref, value, onChange, ...args } }) => (
                  <div className={styles.city}>
                    <label>{t('City')}</label>
                    <AutocompletionOfCities
                      error={(errors as FieldErrors<ProfileUserType>).city?.message}
                      callbackValue={onChange}
                      city={profileData.city || ''}
                      {...args}
                    />
                  </div>
                )}
              />
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field: { onChange, value, ref, ...args } }) => (
                  <div>
                    <label>{t('DateBirthday')}</label>
                    <Calendar
                      data={formCache ? formCache.dateOfBirth : profileData.dateOfBirth}
                      outsideOnChange={onChange}
                      classNameWrap={styles.calendar}
                      {...args}
                    />
                    {(errors as FieldErrors<ProfileUserType>).dateOfBirth && (
                      <p className={styles.errorCalendar}>
                        {(errors as FieldErrors<ProfileUserType>).dateOfBirth?.message}{' '}
                        <Link
                          href={{
                            pathname: `${RoutersPath.authPrivacyPolicy}`,
                            query: { previousPage: `${RoutersPath.profileGeneralInformation}` },
                          }}
                          className={styles.agreementLink}
                          onClick={() => cacheForm()}
                        >
                          {tRoot('PrivacyPolicy')}
                        </Link>
                      </p>
                    )}
                  </div>
                )}
              />
              <ControlledTextField
                as={'textarea'}
                className={styles.textField}
                control={control}
                label={t('AboutMe')}
                name={'aboutMe'}
                rows={4}
              />
            </div>
          </div>
          <div className={styles.line}></div>
          <Button className={styles.button} disabled={Object.keys(errors).length > 0}>
            {tRoot('SaveChanges')}
          </Button>
        </form>
      )}

      {isModal && (
        <Modal
          title={tRoot('Notification')}
          callBackCloseWindow={handleCloseModal}
          extraButtonCB={handleLeftPageWithoutSave}
          mainButtonCB={handleCloseModal}
          extraButton={isSaved ? undefined : tRoot('Yes')}
          mainButton={isSaved ? tRoot('Ok') : tRoot('No')}
        >
          {isSaved ? tRoot('SaveChanges') : tRoot('LeftWithoutSave')}
        </Modal>
      )}
    </div>
  )
}
