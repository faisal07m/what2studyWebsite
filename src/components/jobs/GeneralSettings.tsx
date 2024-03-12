import {
  Form,
  Row,
  Col,
  Input,
  Select,
  Image,
  Tag,
  Space,
  Button,
  Skeleton,
  Checkbox,
  Slider,
  ColorPicker,
  Modal
} from 'antd'
import {
  GlobalOutlined,
  DeleteTwoTone,
  SoundTwoTone,
  DownOutlined
} from '@ant-design/icons'
import { JobOfferBlock } from '../../types/JobOffers'
import { toBase64 } from '../../helpers/toBase64'
import { showNotification } from '../../helpers/notification'
import { useEffect, useState } from 'react'
import Parse from 'parse'
import "../../styles.css"
import { useLocation, useParams } from 'react-router-dom'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import 'react-phone-number-input/style.css'
import { SliderMarks } from 'antd/lib/slider'
import { getCurrentUser, UserType } from '../../types/user'
import TextArea from 'antd/es/input/TextArea'
import ChatClient from "what2study-chatclient";


library.add(faCaretDown);
library.add(faCaretRight);

const { Option } = Select
type GeneralSettingsProps = {
  job: JobOfferBlock,
  onjobChange: (updatedjob: JobOfferBlock) => void,
  parseRef: any
}

const GeneralSettings = ({ job, onjobChange, parseRef }: GeneralSettingsProps) => {
  const { id } = useParams<{ id: string }>()
  const company = getCurrentUser()
  const errorCss = { borderColor: "red", width: "450px" }
  const errorCssInvert = { borderColor: "rgb(217 217 217)", width: "450px" }


  const [errorsValChanged, setErrorCounter] = useState<number>(0)
  //const errorsVal = errorsValProp
  const [errorsVal, setErrorsVal] = useState<{
    title: boolean,
    ausbildungAdressestreet: boolean,
    ausbildungAdressecity: boolean,
    AusbildungsdauerJahre: boolean,
    Startdatum: boolean,
    MitarbeiteranzahlamStandort
  }>({
    title: false,
    ausbildungAdressestreet: false,
    ausbildungAdressecity: false,
    AusbildungsdauerJahre: false,
    Startdatum: false,
    MitarbeiteranzahlamStandort: false
  })
  const requiredField = <p style={{ color: "red", fontSize: "large", marginBottom: "" }}>* <span style={{ fontSize: "small", color: "#ae9c9c" }}>Dieser Wert ist erforderlich</span></p>
  // react useStates 
  const [possiblejobs, setPossiblejobs] = useState<JobOfferBlock[] | null>(
    null
  )
  const [filterArr, setFilterArr] = useState<any>(job.behavior)

  const [scriptTag, setScriptTag] = useState<any>(job.scriptTag)
  const [token, setToken]= useState<any>()
  const [filterArrChangeCounter, setFilterCounter] = useState<number>(0)
  const [filterJSX, setFilterJSX] = useState<JSX.Element>()
  const [jobObj, setJob] = useState<any[] | null>()
  const [profileImages, setProfileImages] = useState<any[] | null>()
  const [changedState, setChangedState] = useState<boolean>(false)
  const [changecount, setchangecount] = useState<number>(0)
  const location = useLocation()
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (changecount > 3) {
      setChangedState(true)

      //location.state = { changedstate: changedState, unSavedObj: job, parseRef: parseRef }
    }
    setchangecount(changecount + 1)
  }, [job])

  useEffect(() => {
    if (changedState == true) {

      location.state = { changedstate: changedState, unSavedObj: job, parseRef: parseRef }
    }
  }, [changedState])

  // Image upload func
  const handleImageUpload = async (image: any, caller: string, imageURL: string) => {

    if (imageURL != "") {
      if (Parse.serverURL.includes("cpstech")) {
        imageURL = imageURL.replace("http:", "https:")

      }
      else if (Parse.serverURL.includes("localhost")) {
        imageURL = imageURL.replace("https:", "http:")
      }
      if (caller == "") {
        job.bubbleIcon?.push(imageURL)
        onjobChange({ ...job, bubbleIcon: job.bubbleIcon })
        imageElement()
      }
      // else {
      //   onjobChange({ ...job, ansprechspartnerProfileBild: imageURL })
      //   setLogoBase64Kontakt(imageURL)
      // }
    }
    else {
      const base64 = await toBase64(image).catch((err) =>
        showNotification({
          type: 'error',
          title: 'Fehler beim Hochladen',
          message: 'Beim Hochladen des Bildes ist ein Fehler aufgetreten.',
        })
      )
      var response = await imageBaseToUrl(base64 as string)
      //var url = response.attributes.bilds._url.replace("http", "https")
      var url = response.attributes.bilds._url
      if (Parse.serverURL.includes("cpstech")) {
        url = url.replace("http:", "https:")

      }
      else if (Parse.serverURL.includes("localhost")) {
        url = url.replace("https:", "http:")
      }
      if (caller == "") {
        job.bubbleIcon?.push(url)
        onjobChange({ ...job, bubbleIcon: job.bubbleIcon })
        imageElement()
      }
      else {
        job.profileImage?.push(url)
        onjobChange({ ...job, profileImage: job.profileImage })
        imageElementProfile()
      }
      // else {
      //   onjobChange({ ...job, ansprechspartnerProfileBild: url })
      //   setLogoBase64Kontakt(url)
      // }
    }

  }



  const [selectedBubble, setSelectedBubble] = useState<string>(job.selectedBubbleIcon)

  const [chatbotName, setChatbotName] = useState<string>(job.name)

  const [selectedProfile, setSelectedProfile] = useState<string>(job.selectedProfileImage)
  // Get current user object
  const currentUser = Parse.User.current()
  useEffect(() => {
    onjobChange({ ...job, selectedBubbleIcon: selectedBubble })

  }, [selectedBubble])

  useEffect(() => {
    onjobChange({ ...job, selectedProfileImage: selectedProfile })

  }, [selectedProfile])

  // Image removal func
  const removeImage = (id: any) => {
    if (job.bubbleIcon != undefined) {
      if (job.selectedBubbleIcon == job.bubbleIcon[id]) {
        setSelectedBubble("")

      }
      onjobChange({ ...job, bubbleIcon: job.bubbleIcon.splice(id, 1) })
      imageElement()

    }
  };
  // Image removal func profile
  const removeImageProfile = (id: any) => {
    if (job.profileImage != undefined) {
      if (job.selectedProfileImage == job.profileImage[id]) {
        setSelectedProfile("")

      }
      onjobChange({ ...job, profileImage: job.profileImage.splice(id, 1) })
      imageElementProfile()

    }
  };




  const imageBaseToUrl = async (base64) => {
    const parseFile = new Parse.File("bild", { base64: base64 as string });
    const responseFile = await parseFile.save();
    const Gallery = Parse.Object.extend('Gallery');
    const gallery = new Gallery();
    gallery.set('bilds', responseFile);
    let response = await gallery.save();

    //setSource(response.attributes.picture._url)
    return response
  }
  // async function simp(imageBase64) {
  //   if (imageBase64.length > 80) {
  //     return await imageBaseToUrl(imageBase64)
  //     // imageList.indexOf(imageBase64) !== -1 && imageList.splice(imageList.indexOf(imageBase64), 1)
  //   }
  //   else{return false}
  // }
  const imageElement = async () => {
    let obj: JSX.Element[] = []
    if (job.bubbleIcon != undefined) {
      obj = job.bubbleIcon.map((img, index) => {
        return <Col key={index} style={{ marginLeft: "15px" }} >
          {job.bubbleIcon ? <Image style={{ width: "100%" }} height={140} src={img} preview={false} onClick={(e) => {
            onjobChange({ ...job, selectedBubbleIcon: img })
            setSelectedBubble(img)
          }} /> : <Skeleton.Image style={{ marginTop: "-20px" }} />}

          <Row style={{ marginLeft: '40%' }}><DeleteTwoTone style={{ fontSize: "25px" }} onClick={() => removeImage(index)}></DeleteTwoTone></Row>
        </Col>
      })
    }
    onjobChange({ ...job })
    setJob(obj)
  }

  const imageElementProfile = async () => {
    let obj: JSX.Element[] = []
    if (job.profileImage != undefined) {
      obj = job.profileImage.map((img, index) => {
        return <Col key={index} style={{ marginLeft: "15px" }} >
          {job.profileImage ? <Image style={{ width: "100%" }} height={140} src={img} preview={false} onClick={(e) => {
            onjobChange({ ...job, selectedProfileImage: img })
            setSelectedProfile(img)

          }} /> : <Skeleton.Image style={{ marginTop: "-20px" }} />}

          <Row style={{ marginLeft: '40%' }}><DeleteTwoTone style={{ fontSize: "25px" }} onClick={() => removeImageProfile(index)}></DeleteTwoTone></Row>
        </Col>
      })
    }
    onjobChange({ ...job })
    setProfileImages(obj)
  }

  // After setting current user object 
  useEffect(() => {
    console.log(/token=.*'/g.exec(job.scriptTag))
    var token = /token=.*'/g.exec(job.scriptTag)
    if(token)
    {
    setToken(token[0].slice(6,-1))
    }

    imageElement()
    imageElementProfile()
    if (filterArr != undefined) {
      setFilterCounter(filterArrChangeCounter + 1)
    }
  }, [currentUser])

  const marks: SliderMarks = {
    // 0: '0',
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    // 6: {
    //   style: {
    //     color: '#f50',
    //   },
    //   label: <strong>100°C</strong>,
    // },
  };
  useEffect(() => {
    onjobChange({ ...job, name: chatbotName })
  }, [chatbotName])
  useEffect(() => {
    onjobChange({ ...job, behavior: filterArr })
  }, [filterArr])


  function addBhavior(filterArray, index, e) {
    filterArray[index].pointOnScale = e
    setFilterArr(filterArray)
    setFilterCounter(filterArrChangeCounter + 1)

  }

  useEffect(() => {
    if (filterArr) {
      var obj = filterArr.map((object, index) => {
        return <Row gutter={28} >
          <Col span={2} >

            <label>{filterArr[index].given}</label>
          </Col>
          <Col span={22} style={{marginTop:"10px"}}>
            <Row gutter={26}>
              <Col span={6} style={{ marginTop: "16px" , alignContent:"right"}}
              >
                {filterArr[index].leftValue}
              </Col>
              <Col span={10} >
                <Slider
                  min={1}
                  max={6}
                  marks={marks}
                  // trackStyle={{ backgroundColor: "rgb(245 245 245)" }}
                  //disabled={!filterArr[index].given}
                  onChange={(e) => {
                    var filterArray = filterArr
                    addBhavior(filterArray, index, e)
                  }}
                  defaultValue={object.pointOnScale}
                  step={1}
                /></Col>
              <Col span={6} style={{ marginTop: "16px" }}
              >
                {filterArr[index].rightValue}</Col>
            </Row>
          </Col>

        </Row>


      })
      setFilterJSX(obj)
    }
  }, [filterArrChangeCounter]);
  const onPublish = () => {
    const {
      name,

    } = job
    let errors: string[] = []
    // if (description.trim() === '') errors.push('Die job muss eine Beschreibung besitzen')
    if (name != null) {
      if (name.trim() === '') {
        errors.push('Die job muss einen Title besitzen')
        var errorVal = errorsVal
        errorVal.title = true
        setErrorsVal(errorVal)
      }
    }

    // if (!location) errors.push('Die job benötigt einen Standort')
    if (errors.length !== 0) {
      setErrorCounter(errorsValChanged + 1)
      return showNotification({
        title: 'Fehler. Bitte überprüfen Sie Ihre Angaben',
        message: `Bitte korrigieren Sie die rot markierten Felder`,
        // n ${errors.map(
        //   (e) => '\n- ' + e
        // )}`,

        type: 'error',
        long: true,
      })
    }

    if (errors.length === 0) {
      onjobChange({ ...job, activeChatbot: true })

    }
  }

  const onUnpublish = () => {
    onjobChange({ ...job, activeChatbot: false })
  }


  const optionsUnterrischt = [
    {
      label: 'Blockunterricht',
      value: 'Blockunterricht',
    },
    {
      label: 'Wöchentlich',
      value: 'Wöchentlich',
    }, {
      label: 'Teilzeitunterricht',
      value: 'Teilzeitunterricht',
    },
  ];
  const optionNA = [
    {
      label: 'n.a',
      value: 'n.a',
    },

  ];


  // return form HTML 
  return (
    <Form layout='vertical' name='basic'>
      <fieldset className="fieldsetCustom">
        <legend>Einstellungen</legend>
        <Row gutter={24} style={{ display: 'flex', alignItems: 'center' }}>
          <Col span='8'>
            <h3>Status</h3>
            <Space>
              <Tag color={job.activeChatbot ? 'green' : 'blue'}>
                {job.activeChatbot ? 'Öffentlich' : 'Entwurf'}
              </Tag>
              <Button
                type='primary' shape='round' icon={<GlobalOutlined />}
                onClick={job.activeChatbot ? onUnpublish : onPublish}
              >
                {job.activeChatbot ? 'Zu Entwurf' : 'Veröffentlichen'}
              </Button>
            </Space>
          </Col>
        </Row><br></br>
        <Row gutter={26}>
          <Col span={10} >
            <Form.Item tooltip="Wie wird Ihr Chatbot genannt? Geben Sie einen Namen für Ihren Chatbot an" style={{ marginTop: "10px", fontWeight: "bold" }}
              label={<p style={{ fontSize: "22px" }}>Name des Chatbots</p>} name='name' rules={[
                {
                  //  required: true,
                  //  message: "Dieses Feld ist erforderlich"
                }
              ]} >
              <Input
                style={errorsVal.title ? errorCss : errorCssInvert}
                placeholder='Name des Bot'
                defaultValue={chatbotName}
                //value={job.title}
                onChange={(e) => {
                  setChatbotName(e.target.value)
                  var errorVal = errorsVal
                  errorVal.title = false
                  setErrorsVal(errorVal)
                }
                }

              />
              {requiredField}

            </Form.Item>
            <label style={{ fontWeight: "bold", fontSize: "22px" }}> Einstellungen</label>
            <Form.Item label='Sprache des Chatbots' name='chatbotLanguage' style={{ marginTop: "10px" }}>
              <Select
                style={{ width: "200px" }}

                defaultValue={job.language || 'English'}
                onChange={(value) => onjobChange({ ...job, language: value.toString() })}
              >

                <Option value='English'>English</Option>
                <Option value='German'>Deutsch</Option>

              </Select>

            </Form.Item>
            <label> Sprachausgabe</label><br></br>

            <SoundTwoTone style={{ fontSize: "large" }} /> <Checkbox checked={job.AudioNarration} style={{ marginTop: "3px", marginLeft: "10PX" }} onChange={(e) => {
              onjobChange({ ...job, AudioNarration: !job.AudioNarration })
            }}>Text zu Audio</Checkbox><br></br>

            <Form.Item label='Stimme' name='Narrator' style={{ marginTop: "10px" }}>
              <Select
                style={{ width: "200px" }}

                defaultValue={job.Narrator || 'Male'}
                onChange={(value) => onjobChange({ ...job, Narrator: value.toString().toLowerCase() })}
              >

                <Option value='Male'>Männlich</Option>
                <Option value='Female'>Weiblich</Option>

              </Select>

            </Form.Item>



          </Col>

          <Col span={11} >
            <label style={{ fontWeight: "bold", fontSize: "22px" }}>Verhalten des Chatbots</label>

            {filterJSX}
          </Col>

        </Row>

        {/* <Row> <Col span={5} >
          <Form.Item label='Empfohlener Bildungsabschluss' name='ErforderlicherBildungsabschluss'>
            <Select
              style={{ width: "200px" }}

              defaultValue={job.ErforderlicherBildungsabschluss || 'Keine Angabe'}
              onChange={(value) => onjobChange({ ...job, ErforderlicherBildungsabschluss: value.toString() })}
            >
              
              <Option value='Keine Angabe'>Keine Angabe</Option>
              <Option value='Abitur'>Abitur</Option>
              <Option value='Fachhochschulreife'>Fachhochschulreife</Option>
              <Option value='Mittlerer Schulabschluss'>Mittlerer Schulabschluss</Option>
              <Option value='Hauptschulabschluss'>Hauptschulabschluss</Option>
              <Option value='Kein Schulabschluss'>Kein Schulabschluss</Option>

            </Select>
          </Form.Item>
        </Col></Row> */}
        <Row >
          {/* <Col span={4} >
            <Form.Item label='Ausbildungsdauer (Jahre)' name='AusbildungsdauerJahre'  >
              <Select

                style={errorsVal.AusbildungsdauerJahre ? errorCssSelect : errorCssInvertSelect}
                bordered={true}
                size="middle"
                defaultValue={job.AusbildungsdauerJahre || '0'}
                onChange={(value) => {
                  onjobChange({ ...job, AusbildungsdauerJahre: value.toString() })
                  var errorVal = errorsVal
                  errorVal.AusbildungsdauerJahre = false
                  setErrorsVal(errorVal)
                }}
              >
                <Option value='1'>1</Option>
                <Option value='1.5'>1.5</Option>
                <Option value='2'>2</Option>
                <Option value='2.5'>2.5</Option>
                <Option value='3'>3</Option>
                <Option value='3.5'>3.5</Option>
                <Option value='4'>4</Option>
                <Option value='4.5'>4.5</Option>
                <Option value='5'>5</Option>
                <Option value='5.5'>5.5</Option>
                <Option value='6'>6</Option>
                <Option value='6.5'>6.5</Option>

              </Select>

              {requiredField}
            </Form.Item>
          </Col> */}


        </Row>
        <label style={{ fontSize: "23px", fontWeight: "bold" }}>Chatbot-Icon</label>
        <Row gutter={24} style={{ marginTop: "25px" }}>
          <Col span={3}>
            {selectedBubble ? <Image style={{ height: "100%", width: "100%", borderRadius: "20%", border: "2px solid #00ADDC", padding: "2px" }} src={selectedBubble} /> : <Skeleton.Image style={{ marginTop: "-20px" }} />}
          </Col>
          <Col span={20}>
            <Form.Item id="imageContainerJobs" tooltip='Hochladen des Sprechblasen-Symbols für den Chatbot' label=' Unterstützte Formate: jpeg/png' name='image'>
              <Row id="imageContainerJob">

                <button style={{ marginLeft: "15px", border: "none", height: "fit-content" }}> <input
                  type='file'
                  accept='image/png, image/jpeg'

                  onChange={(e) => {
                    if (e.target.files) {
                      if (e.target.files?.length > 0) {
                        handleImageUpload(e.target.files[0], '', '')
                      }
                    }
                  }

                  }
                  style={{ color: "#efefef", marginLeft: "-8px", marginRight: "-8px", marginTop: "-2px", height:"145px",marginBottom: '-90px', position: "relative", width: '134px', background: "rgb(245 245 245)", border: "none !important", fontSize: "16px", cursor: "pointer" }}
                >
                </input>
                </button>


              </Row>
              <Row>{jobObj}</Row>

            </Form.Item>
          </Col>

          {/* <Col span={3}>
            <MediaPreview mediaType='Bilder' saveCallback={(url: any, index: any) => {
            
              if (url) { handleImageUpload(null, '', url) }
            }}> </MediaPreview> 
          </Col> */}
        </Row>

      </fieldset>

      {/* <fieldset className="fieldsetCustom">
        <legend>Eigenschaften der Ausbildung bzw. Ausbildungsstätte       <Tooltip placement="topLeft" title="Schülerinnen und Schüler können sich in der App basierend auf ihren Vorlieben bestimmte Ausbildungen einblenden lassen">
          <QuestionCircleOutlined />
        </Tooltip></legend>
        {filterJSX}


      </fieldset> */}




      <fieldset className="fieldsetCustom">
        <legend>Erscheinungsbild</legend>
        <label style={{ fontWeight: "bold", fontSize: "23px" }}>Chatbot: Corporate Identity</label>
        <br></br>
        <br></br>
        <label>Chatbot Kopfzeile </label>
        <Row gutter={26} style={{ margin: "15px" }}>
          <Col span={5} style={{ textAlign: "center" }}>
            <label>Hintergrundfarbe</label><br></br>
            <ColorPicker
              size='large'
              defaultValue={job.headerColor || "#0c8de9"}
              onChange={(e, s) => {
                onjobChange({ ...job, headerColor: s.toString() })
              }}
              showText={() => (
                <DownOutlined
                  style={{
                    color: "rgba(0, 0, 0, 0.25)",
                  }}
                />
              )}
            />
          </Col>
          <Col span={4} style={{ textAlign: "center" }}>
            <label>Icon & Schriftfarbe</label> <br></br>
            <ColorPicker
              size='large'
              defaultValue={job.headerIconFontColor || "#ffffff"}
              onChange={(e, s) => {
                onjobChange({ ...job, headerIconFontColor: s.toString() })
              }}

              showText={() => (
                <DownOutlined
                  style={{
                    color: "rgba(0, 0, 0, 0.25)",
                  }}
                />
              )}
            />
          </Col>
          <Col span={4}></Col>
          <Col span={4} style={{ textAlign: "center" }}>
            <label>Chatbot Hintergrundfarbe</label><br></br>
            <ColorPicker
              size='large'
              defaultValue={job.chatbotBackgroundColor || "#ffffff"}
              onChange={(e, s) => {
                onjobChange({ ...job, chatbotBackgroundColor: s.toString() })
              }}

              showText={() => (
                <DownOutlined
                  style={{
                    color: "rgba(0, 0, 0, 0.25)",
                  }}
                />
              )}
            />
          </Col>

        </Row>
        <label>Textbox Nutzer:in </label>

        <Row gutter={26} style={{ margin: "15px" }}>
          <Col span={5} style={{ textAlign: "center" }}>
            <label>Farbe</label><br></br>
            <ColorPicker
              size='large'
              defaultValue={job.textBoxColorUser || "#e0e0e0"}
              onChange={(e, s) => {
                onjobChange({ ...job, textBoxColorUser: s.toString() })
              }}

              showText={() => (
                <DownOutlined
                  style={{
                    color: "rgba(0, 0, 0, 0.25)",
                  }}
                />
              )}
            />
          </Col>
          <Col span={4} style={{ textAlign: "center" }}>
            <label>Schriftfarbe</label> <br></br>
            <ColorPicker
              size='large'
              defaultValue={job.fontColorUser || "#000000"}
              onChange={(e, s) => {
                onjobChange({ ...job, fontColorUser: s.toString() })
              }}

              showText={() => (
                <DownOutlined
                  style={{
                    color: "rgba(0, 0, 0, 0.25)",
                  }}
                />
              )}
            />
          </Col>
          <Col span={4} style={{ textAlign: "center" }}>
            <label>Schriftart</label><br></br>
            <Select
              style={{ width: "200px" }}

              defaultValue={job.fontstyleUser || 'Inter'}
              onChange={(value) => onjobChange({ ...job, fontstyleUser: value.toString() })}
            >

              <Option value='Inter'>Inter</Option>
              <Option value='Poppins'>Poppins</Option>
              <Option value='Roboto'>Roboto</Option>

            </Select>

          </Col>
          <Col span={4} style={{ textAlign: "center" }}>
            <label>Group A UI Hintergrund</label><br></br>
            <ColorPicker
              size='large'
              defaultValue={job.uiBackgroundGroupA || "rgb(100, 100, 100)"}
              onChange={(e, s) => {
                onjobChange({ ...job, uiBackgroundGroupA: s.toString() })
              }}

              showText={() => (
                <DownOutlined
                  style={{
                    color: "rgba(0, 0, 0, 0.25)",
                  }}
                />
              )}
            />
          </Col>
          <Col span={4} style={{ textAlign: "center" }}>
            <label>Group A UI Hightlight</label><br></br>
            <ColorPicker
              size='large'
              defaultValue={job.uiHighLightGroupA || "rgb(200, 200, 200)"}
              onChange={(e, s) => {
                console.log("hehehe")
                console.log(s)
                console.log(s.toString())
                onjobChange({ ...job, uiHighLightGroupA: s.toString() })
              }}

              showText={() => (
                <DownOutlined
                  style={{
                    color: "rgba(0, 0, 0, 0.25)",
                  }}
                />
              )}
            />
          </Col>
        </Row>
        <label>Textbox Chatbotantwort</label>

        <Row gutter={26} style={{ margin: "15px" }}>
          <Col span={5} style={{ textAlign: "center" }}>
            <label>Farbe</label><br></br>
            <ColorPicker
              size='large'
              defaultValue={job.textBoxColorChatbotReply || "#00ADDC"}
              onChange={(e, s) => {
                onjobChange({ ...job, textBoxColorChatbotReply: s.toString() })
              }}

              showText={() => (
                <DownOutlined
                  style={{
                    color: "rgba(0, 0, 0, 0.25)",
                  }}
                />
              )}
            />
          </Col>
          <Col span={4} style={{ textAlign: "center" }}>
            <label>Schriftfarbe</label> <br></br>
            <ColorPicker
              size='large'
              defaultValue={job.fontColorChatbotReply || "#00ADDC"}
              onChange={(e, s) => {
                onjobChange({ ...job, fontColorChatbotReply: s.toString() })
              }}
              showText={() => (
                <DownOutlined
                  style={{
                    color: "rgba(0, 0, 0, 0.25)",
                  }}
                />
              )}
            />
          </Col>
          <Col span={4} style={{ textAlign: "center" }}>
            <label>Schriftart</label><br></br>
            <Select
              style={{ width: "200px" }}

              defaultValue={job.fontstyleChatbotReply || 'Inter'}
              onChange={(value) => onjobChange({ ...job, fontstyleChatbotReply: value.toString() })}
            >
              <Option value='Inter'>Inter</Option>
              <Option value='Poppins'>Poppins</Option>
              <Option value='Roboto'>Roboto</Option>

            </Select>
          </Col>
          <Col span={4} style={{ textAlign: "center" }}>
            <label>Group B UI Hintergrund</label><br></br>
            <ColorPicker
              size='large'
              defaultValue={job.uiBackgroundGroupB || "rgb(50, 50, 50)"}
              onChange={(e, s) => {
                onjobChange({ ...job, uiBackgroundGroupB: s.toString() })
              }}

              showText={() => (
                <DownOutlined
                  style={{
                    color: "rgba(0, 0, 0, 0.25)",
                  }}
                />
              )}
            />
          </Col>
          <Col span={4} style={{ textAlign: "center" }}>
            <label>Group B UI Hightlight</label><br></br>
            <ColorPicker
              size='large'
              defaultValue={job.uiHighLightGroupB || "rgb(150, 150, 150)"}
              onChange={(e, s) => {
                onjobChange({ ...job, uiHighLightGroupB: s.toString() })
              }}

              showText={() => (
                <DownOutlined
                  style={{
                    color: "rgba(0, 0, 0, 0.25)",
                  }}
                />
              )}
            />
          </Col>
        </Row>

        <label style={{ fontSize: "23px", fontWeight: "bold" }}>Chatbot-Profilbild</label>
        <Row gutter={24} style={{ marginTop: "25px" }}>
          <Col span={3}>
            {selectedProfile ? <Image style={{ height: "100%", width: "100%", borderRadius: "20%", border: "2px solid #00ADDC", padding: "2px" }} src={selectedProfile} /> : <Skeleton.Image style={{ marginTop: "-20px" }} />}
          </Col>
          <Col span={20}>
            <Form.Item id="imageContainerProfile" tooltip='Profilbild hochladen' label='Unterstützte Formate: jpeg/png' name='image2'>
              <Row id="imageContainerProfile">

                <button style={{ marginLeft: "15px", border: "none", height: "fit-content" }}> <input
                  type='file'
                  accept='image/png, image/jpeg'

                  onChange={(e) => {
                    if (e.target.files) {
                      if (e.target.files?.length > 0) {
                        handleImageUpload(e.target.files[0], 'profile', '')
                      }
                    }
                  }

                  }
                  style={{ color: "#efefef", marginLeft: "-8px", marginRight: "-8px", marginTop: "-2px", height:"145px", marginBottom: '-90px', position: "relative", width: '134px', background: "rgb(245 245 245)", border: "none !important", fontSize: "16px", cursor: "pointer" }}
                >
                </input>
                </button>


              </Row>
              <Row>{profileImages}</Row>

            </Form.Item>
          </Col>

          {/* <Col span={3}>
            <MediaPreview mediaType='Bilder' saveCallback={(url: any, index: any) => {
            
              if (url) { handleImageUpload(null, '', url) }
            }}> </MediaPreview> 
          </Col> */}
        </Row>

      </fieldset>

      <fieldset className="fieldsetCustom">
        <Row gutter={24} style={{ display: 'flex', alignItems: 'center' }}>
          <Col span={12}>
            <label style={{ fontWeight: "bold", fontSize: "large" }}>Zufällige Frage</label>
            <Checkbox style={{ marginLeft: "10PX", fontSize: "large" }} checked={job.randomQuestionEnabled} onChange={(e) => {
              onjobChange({ ...job, randomQuestionEnabled: !job.randomQuestionEnabled })
            }}></Checkbox>
            <p>Welche Informationen sollen angegeben werden, wenn der Chatbot den Hinweis gibt eine beliebige Frage zu stellen?</p>
            <br></br>
            <TextArea
              defaultValue={job.randomQuestion || "Unsicher, welche Fragen man mir stellen kann? Ich stehe bei verschiedensten Themen zur Verfügung und versuche zu helfen. Unter anderem kann ich konkrete Informationen zu Studiengängen, Zulassungsvoraussetzungen, Campusleben oder Unterstützungsangeboten geben. Aber auch allgemeine Fragen rundum das Hochschulsystem beantworten. Hier sind einige Beispielfragen, die interessant sein könnten: \n\nWelche Studiengänge bietet die Universität an?\nWie lauten die Zulassungsvoraussetzungen für den Studiengang XYZ?\nKannst du mir mehr über das Campusleben berichten?\nWelche Unterstützungsangebote gibt es für Studierende?\nWie bewerbe ich mich für ein Studium an dieser Universität?"}
              style={{ marginTop: "-20px" }}
              onChange={(e) => {
                onjobChange({ ...job, randomQuestion: e.target.value })
              }
              }

              autoSize={{ minRows: 12, maxRows: 15 }}
            />


          </Col>
          <Col span={12}>
            <label style={{ fontWeight: "bold", fontSize: "large" }}>Sprich mit uns  </label>
            <Checkbox style={{ marginLeft: "10PX", fontSize: "large" }} checked={job.talkToaHumanEnabled} onChange={(e) => {
              onjobChange({ ...job, talkToaHumanEnabled: !job.talkToaHumanEnabled })
            }}></Checkbox>
            <p>Welche Informationen sollten bereitgestellt werden bei der Option "Sprich mit uns"?</p>
            <br></br>
            <TextArea
              defaultValue={job.talkToaHuman || "Wir freuen uns, dass Sie direkt mit uns in Kontakt treten möchten, gerne können Sie hierzu die angegebenen Optionen nutzen. \n\nBitte beachten Sie unsere Öffnungszeiten und gewähren Sie uns nach Möglichkeit Einblick in Ihren Chatverlauf, damit wir direkt sehen können, um welches Problem es sich handelt. Sollte gerade niemand verfügbar sein können wir uns auch auf Wunsch bei Ihnen melden."}
              onChange={(e) => {
                onjobChange({ ...job, talkToaHuman: e.target.value })
              }
              }

              autoSize={{ minRows: 12, maxRows: 15 }}
            />


          </Col>

        </Row>

      </fieldset>


      <Row gutter={24} style={{ display: 'flex', alignItems: 'center' }}>
        <Col span='5'>
          <h3>Status</h3>
          <Space>
            <Tag color={job.activeChatbot ? 'green' : 'blue'}>
              {job.activeChatbot ? 'Öffentlich' : 'Entwurf'}
            </Tag>
            <Button
              type='primary' shape='round' icon={<GlobalOutlined />}
              onClick={job.activeChatbot ? onUnpublish : onPublish}
            >
              {job.activeChatbot ? 'Zu Entwurf' : 'Veröffentlichen'}
            </Button>
          </Space>

        </Col>
        <Col>
            <h3>Chatbot-Integration</h3>

            <Button type="default" onClick={showModal}>
             Klick mich!
            </Button>
          </Col>

      </Row>
      <ChatClient 
      objectId= {id}
      userId={job.user}
      universityId= {job.user}
      // accessToken={token}
      // chatbotId={id}
       chatbotBubbleIcons={job.selectedBubbleIcon}
       chatbotProfileImage={job.selectedProfileImage}
       chatbotLook={
        {chatbotHeader: {
          chatbotHeaderBackgroundColor: job.headerColor,
          chatbotHeaderIconFontColor: job.headerIconFontColor,
        },
        chatbotBackground: {
          chatbotBackgroundColor: job.chatbotBackgroundColor,
        },
        textBoxUser: {
          textBoxUserColor:job.textBoxColorUser,
          textBoxUserFontColor: job.fontColorUser,
          textBoxFontStyle: job.fontstyleUser,
        },
        textBoxChatbotReply: {
          textBoxChatbotReplyColor: job.textBoxColorChatbotReply,
          textBoxChatbotReplyFontColor: job.fontColorChatbotReply,
          textBoxChatboxReplyFontStyle: job.fontstyleChatbotReply,
        },
        UIGroupA: {
          UIGroupAUIBackground: job.uiBackgroundGroupA,
          UIGroupAUIHighlight: job.uiHighLightGroupA,
        },
        UIGroupB: {
          UIGroupBUIBackground: job.uiBackgroundGroupB,
          UIGroupBUIHighlight: job.uiHighLightGroupB,
        },
        chatbotLookName: job.name,
      }}
      ></ChatClient>
      <Modal
        open={open}
        title="Chatbot Integration"
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Schließen
          </Button>,
          // <Button
          //   key="link"
          //   type="primary"
          //   onClick={handleOk}
          // >
          //   In Zwischenablage kopieren
          // </Button>,
        ]}
      >
        <h4>Kopieren Sie das folgende Skript und fügen Sie es in Ihre HTML-Seite ein, um den Chat-Client in Ihre Website zu integrieren.</h4>
        <p style={{backgroundColor:"lightagrey", padding:"60px", fontFamily:"monospace"}}>{scriptTag}</p>

      </Modal>
    </Form>


  )
}

export default GeneralSettings




// chatbotBubbleIcons: "https://static-00.iconduck.com/assets.00/chat-icon-1024x1024-o88plv3x.png",
//     chatbotProfileImage: "https://openclipart.org/image/2000px/307415",
//     defaultSettings: {
//         chatbotLanguage: "English",
//         audioNarration: true,
//         narrator: "John",
//     },
//     chatboxBehaviour: {
//         formality: 0,
//         opinion: 0,
//         emotion: 0,
//         length: 0,
//         topics: 0,
//         tone: 0,
//         chatbotBehaviourName: "",
//     },
//     chatbotReplies: {
//         randomQuestions: true,
//         showRandomQuestionsMessage: "",
//     },
//     chatbotContact: {
//         talkToHuman: true,
//         showTalkToHumanMessage: "Connecting to a human...",
//     },
//     chatbotLook: {
//         chatbotHeader: {
//             chatbotHeaderBackgroundColor: "#0c8de9",
//             chatbotHeaderIconFontColor: "#ffffff",
//         },
//         chatbotBackground: {
//             chatbotBackgroundColor: "#ffffff",
//         },
//         textBoxUser: {
//             textBoxUserColor: "#0c8de9",
//             textBoxUserFontColor: "#ffffff",
//             textBoxFontStyle: "bold",
//         },
//         textBoxChatbotReply: {
//             textBoxChatbotReplyColor: "#e0e0e0",
//             textBoxChatbotReplyFontColor: "#000000",
//             textBoxChatboxReplyFontStyle: "normal",
//         },
//         UIGroupA: {
//             UIGroupAUIBackground: "rgb(100, 100, 100)",
//             UIGroupAUIHighlight: "rgb(200, 200, 200)",
//         },
//         UIGroupB: {
//             UIGroupBUIBackground: "rgb(50, 50, 50)",
//             UIGroupBUIHighlight: "rgb(150, 150, 150)",
//         },

