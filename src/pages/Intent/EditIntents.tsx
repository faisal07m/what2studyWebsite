import { useEffect, useState } from 'react'
import { Tabs, Result, Row } from 'antd'
import PageContainer from '../../components/layout/PageContainer'
import GeneralSettings from '../../components/intents/GeneralSettings'
import { useHistory, useParams } from 'react-router-dom'
import Parse from 'parse'
import { showNotification } from '../../helpers/notification'
import { useLocation } from 'react-router-dom';
import { IntentClass, Intents } from '../../types/IntentClass'
const { TabPane } = Tabs

const EditJobs = () => {
  let history = useHistory()
  const { id } = useParams<{ id: string }>()
  const [intent, setIntents] = useState<IntentClass | null>(null)
  const [error, setError] = useState<boolean>(false)
  const [parseRef, setParseRef] = useState<Parse.Object>()
  const [pending, setPending] = useState<boolean>(false)
  const location = useLocation()

  
  
  useEffect(() => {
    const query = new Parse.Query(Intents)
    query
      .get(id)
      .then(async (res) => {
        setIntents(res.attributes as IntentClass)
        setParseRef(res)
      })
      .catch(() => {
        setError(true)
      })
  }, [id])



  const onSave = async () => {
      if (intent && parseRef) {
        setPending(true)
        try {
          var temp = await parseRef.save(intent)
          var curUserobject = await Parse.User.current()
          
          showNotification({
            title: 'Erfolgreich gespeichert',
            message: `${intent.name} wurde erfolgreich gespeichert`,
            type: 'success',
          })
          return history.push('/what2study/intents')
        } catch (error) {
          showNotification({
            title: 'Fehler beim Speichern',
            message: `Es ist ein Fehler aufgetreten. Bitte stelle sicher, dass Du eine aktive Internetverbindung hast und versuche es erneut.`,
            type: 'error',
          })
        }
      }
    return
  }

  if (error)
    return (
      <PageContainer pageId='5' title='Fehler beim Laden der Chatbots'>
        <Result
          status={500}
          title='Fehler beim Laden der Chatbots'
          subTitle='Bitte versuche es später erneut'
        />
      </PageContainer>
    )

  if (!intent)
    return (
      <PageContainer pageId='5' title='Absichten werden geladen...'>
        <h1>Lädt...</h1>
      </PageContainer>
    )

  return (
    <PageContainer
      button
      buttonText='Speichern'
      buttonCallback={onSave}
      pageId='5'
      //title={`"${job.title}" bearbeiten`}
      title={intent?.name ? '"' + intent?.name + '" bearbeiten' : ""}
      buttonLoading={pending}
    >

      <GeneralSettings
        intent={intent}
        onIntentChange={(updateIntent: IntentClass) => setIntents(updateIntent)}
        parseRef={parseRef}
      />
     
    </PageContainer>
  )
}

export default EditJobs
