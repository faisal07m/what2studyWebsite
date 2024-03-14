import PageContainer from '../components/layout/PageContainer'
import Parse from 'parse'
import { useHistory } from 'react-router-dom'
import { Row, Col, Tabs, Upload, Button, UploadProps, Form, Select, DatePicker, Input, Checkbox, Spin } from 'antd'

import { InboxOutlined, PlusOutlined, SearchOutlined, SendOutlined } from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one';
import { knowledgeBaseBlock, generateKnowledge, getKnowledgeBase } from '../types/knowledgeBase'
import type { ConfigProviderProps, RadioChangeEvent } from 'antd';

import ChatClient from "what2study-chatclient";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Tooltip,
  Bar,
  PieChart, Pie, Sector, Cell
} from 'recharts'
import { useEffect, useRef, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons'
import { showNotification } from '../helpers/notification'
import { toBase64 } from '../helpers/toBase64'
import { getCurrentUser } from '../types/user'
import dayjs from 'dayjs'
import TagComponent from './TagComponent';
import FilesListTable from './FilesListTable';
import TextArea from 'antd/es/input/TextArea';
import { getActiveChatbotID, getScriptTag } from '../types/JobOffers';
import { SERVER_URL, SERVER_URL_parsefunctions, ServerCrawl } from '../config/parse';

const Overview = () => {

  const { Option } = Select
  const history = useHistory()
  history.push('/what2study/database')
  type SizeType = ConfigProviderProps['componentSize'];
  const [size, setSize] = useState<SizeType>('large');
  const [size2, setSize2] = useState<SizeType>('large');
  const curUser = Parse.User.current()
  const [curUserId, setCurUserId] = useState<string>();
  const [activeChatbotID, setActiveChatID] = useState<any>("")

  var activeIDset=async ()=>{
    let res = await getActiveChatbotID()
    setActiveChatID(res)
  }
  useEffect(() => {
   activeIDset()
   setCurUserId(curUser?.id)
  }, [])
  var currentUser = Parse.User.current()
  const [knowledgebases, setknowledgeBases] = useState<knowledgeBaseBlock[] | null>(null)

  const [base64, setBase64] = useState<any>()

  const [priority, setPriority] = useState<string>("")

  const [indexFileContent, setIndex] = useState<string>("")

  const [transcript, setTranscript] = useState<string>("")

  const [urlViewer, setUrlViewer] = useState<string>("https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js")
  const [loader, setLoader] = useState<any>(false)

  const [urlCrawler, setUrlCrawler] = useState<string>("")
  const [tagsArray, setTagsArray] = useState<string[]>([])

  const [fileName, setFileName] = useState<string>("")

  const [url, setUrl] = useState<string>("")

  const [defaultActiveKey, setDefKey] = useState<string>("1")

  const [token, setToken] = useState<any>()
  const [scriptTag, setScriptTag] = useState<any>()
  const [expires, setExpiry] = useState<string>(dayjs().year() + "/" + "02")
  const setScriptTagAsync = async () => {
    getScriptTag().then(function (val) {
      var token = /token=.*'/g.exec(val)
      if (token) {
        setToken(token[0].slice(6, -1))
      }
      return val
    })
  }
  useEffect(() => {
    setScriptTagAsync()
  }, [])

  const JSXelementTable = (id) => {
    return <Tabs
      defaultActiveKey={localStorage.getItem("tableID")||id}
      // activeKey={localStorage.getItem("tableID")||id}
      type="card"
      size={size2}
      items={new Array(4).fill(null).map((_, i) => {
        const id = String(i + 1);
        return {
          label: <>{id == "1" ? <>Dateien</> : id == "2" ? <>Text</> : id == "3" ? <>Medien</> : id == "4" ? <>URL</> : <></>}</>,
          key: id,
          children: <> <FilesListTable id={id}></FilesListTable></>,
        };
      })}
    />
  }

  const [tableJSX, setTableJSX] = useState<JSX.Element>(JSXelementTable(defaultActiveKey))
  useEffect(()=>{
  localStorage.setItem("tableID", defaultActiveKey)
  setTableJSX(JSXelementTable(localStorage.getItem("tableID")))
  
  },[defaultActiveKey])

  const monthFormat = 'YYYY/MM';

  const props: UploadProps = {
    accept: "application/pdf",
    customRequest: async (componentsData) => {
      return true
    },

    async beforeUpload(file) {

      setFileName(file.name)
      const base64 = await toBase64(file).catch((err) =>
        showNotification({
          type: 'error',
          title: 'Fehler beim Hochladen',
          message: 'Beim Hochladen des Bildes ist ein Fehler aufgetreten.',
        })
      )
      setBase64(base64)
      return true
    },
    onChange({ file, fileList }) {
      if (file.status !== 'uploading') {
      }
      file.status = "done"
    },
    defaultFileList: [
      // {
      //   uid: '1',
      //   name: 'xxx.png',
      //   status: 'uploading',
      //   url: 'http://www.baidu.com/xxx.png',
      //   percent: 33,
      // },
    ],
  };

  const propsText: UploadProps = {
    accept: "text/plain",
    customRequest: async (componentsData) => {
      return true
    },

    async beforeUpload(file) {

      setFileName(file.name)
      const base64 = await toBase64(file).catch((err) =>
        showNotification({
          type: 'error',
          title: 'Fehler beim Hochladen',
          message: 'Beim Hochladen des Bildes ist ein Fehler aufgetreten.',
        })
      )
      setBase64(base64)
      return true
    },
    onChange({ file, fileList }) {
      if (file.status !== 'uploading') {
      }
      file.status = "done"
    },
    defaultFileList: [
      // {
      //   uid: '1',
      //   name: 'xxx.png',
      //   status: 'uploading',
      //   url: 'http://www.baidu.com/xxx.png',
      //   percent: 33,
      // },
    ],
  };

  const propsMedia: UploadProps = {
    accept: "image/png, image/jpeg, image/jpg,video/mp4",
    customRequest: async (componentsData) => {
      return true
    },

    async beforeUpload(file) {

      setFileName(file.name)
      const base64 = await toBase64(file).catch((err) =>
        showNotification({
          type: 'error',
          title: 'Fehler beim Hochladen',
          message: 'Beim Hochladen des Bildes ist ein Fehler aufgetreten.',
        })
      )
      setBase64(base64)
      return true
    },
    onChange({ file, fileList }) {
      if (file.status !== 'uploading') {
      }
      file.status = "done"
    },
    defaultFileList: [
      // {
      //   uid: '1',
      //   name: 'xxx.png',
      //   status: 'uploading',
      //   url: 'http://www.baidu.com/xxx.png',
      //   percent: 33,
      // },
    ],
  };

  const submitKnowledgeBase = async (fileType) => {
    let fileObjName = ""
    let className = ""
    let propertyName = ""
    if (fileType == "pdf") {
      fileObjName = "pdfUpload"
      className = "PDF"
      propertyName = "pdf"
      setDefKey("1")
    }
    else if (fileType == "text") {
      fileObjName = "textUpload"
      className = "TEXT"
      propertyName = "text"
      setDefKey("2")
    }
    else if (fileType == "media") {
      fileObjName = "mediaUpload"
      className = "Media"
      propertyName = "media"
      setDefKey("3")
    }
    else {
      fileObjName = "url"
      className = "URL"
      propertyName = "url"
      setDefKey("4")
    }
    if (base64 != undefined) {
      const parseFile = new Parse.File(fileObjName, { base64: base64 as string });
      parseFile.save().then(async (responseFile) => {
        const Gallery = Parse.Object.extend(className);
        const gallery = new Gallery();
        gallery.set(propertyName, responseFile);

        let response = await gallery.save();
        var url = response.attributes[propertyName]._url
        if (Parse.serverURL.includes("cpstech")) {
          url = url.replace("http:", "https:")

        }
        else if (Parse.serverURL.includes("localhost")) {
          url = url.replace("https:", "http:")
        }
        setUrl(url)
        setUrlViewer(url)
        setFileName(fileName)
        generateKnowledge({
          name: fileName,
          user: currentUser?.id,
          type: fileType,
          priority: priority,
          expires: expires,
          tags: tagsArray,
          transcript: transcript,
          fileUrl: url
        }).then(data => {
          setTableJSX(<></>)
          setTableJSX(JSXelementTable(localStorage.getItem("tableID")))
          setLoader(false)
          showNotification({
            title: 'Datei erfolgreich hochgeladen',
            message: 'Erfolg',
            type: 'success',
          })
          let formData = { url: url, fileName: fileName, user: currentUser?.id, indexFile: "" }


          const response = fetch(
            SERVER_URL_parsefunctions+"/uploadPythonFile",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Parse-Application-Id": "what2study",
                "X-Parse-Master-Key": "what2studyMaster",
              },
              body: JSON.stringify(formData),
            }
          );


          return true

        })
          .catch(error => {
            console.log('Error fetching profile ' + error)
            setLoader(false)
          })
      }).catch((e) => {
        setLoader(false)
        showNotification({
          type: 'error',
          title: 'Bitte überprüfen Sie den Dateinamen. Entfernen Sie Zahlen wie (1)* am Ende des Dateinamens, falls vorhanden.',
          message: '',
        })
      })
    }
    else {
      setLoader(false)
      showNotification({
        type: 'error',
        title: 'Bitte überprüfen Sie den Dateinamen. Entfernen Sie Zahlen wie (1)* am Ende des Dateinamens, falls vorhanden.',
        message: '',
      })
    }

  }

  const saveCrawlData = async (data) => {
    setIndex(data["indexFileContent"])
    var blob = new Blob([data["data"]], { type: 'text/plain' });
    var file = new File([blob], "urlfile", { type: "text/plain" });
    setFileName("urlFile")
    const base64 = await toBase64(file).catch((err) =>
      showNotification({
        type: 'error',
        title: 'Fehler beim Hochladen',
        message: 'Beim Hochladen des Bildes ist ein Fehler aufgetreten.',
      })
    )
    var fileObjName = "url"
    var className = "URL"
    var propertyName = "url"

    const parseFile = new Parse.File(fileObjName, { base64: base64 as string });
    parseFile.save().then(async (responseFile) => {
      const Gallery = Parse.Object.extend(className);
      const gallery = new Gallery();
      gallery.set(propertyName, responseFile);

      let response = await gallery.save();
      var url = response.attributes[propertyName]._url
      if (Parse.serverURL.includes("cpstech")) {
        url = url.replace("http:", "https:")

      }
      else if (Parse.serverURL.includes("localhost")) {
        url = url.replace("https:", "http:")
      }
      setUrl(url)
      setUrlViewer(url)
     
      if(urlCrawler.startsWith("https"))
     { var tempFileNameArr = urlCrawler.split("https://")
      var tempFileName}
      else if(urlCrawler.startsWith("http"))
     { var tempFileNameArr = urlCrawler.split("https://")
      var tempFileName}
      else{
        var tempFileNameArr = urlCrawler.split("/")
        var tempFileName
      }

      if(tempFileNameArr){
        tempFileName=tempFileNameArr[1].replaceAll("/","_")
      }
      setDefKey("4")
      // setFileName(response.attributes[propertyName]._name)
      var res = await generateKnowledge({
        // name: response.attributes[propertyName]._name,
        name: tempFileName,
        user: currentUser?.id,
        type: "url",
        priority: priority,
        expires: expires,
        tags: tagsArray,
        transcript: transcript,
        fileUrl: url
      })
      setTableJSX(<></>)
      setTableJSX(JSXelementTable(localStorage.getItem("tableID")))
      setLoader(false)
      showNotification({
        title: 'Datei erfolgreich hochgeladen',
        message: 'Erfolg',
        type: 'success',
      })
      let formData = { url: url, fileName: response.attributes[propertyName]._name, user: currentUser?.id, indexFile: data["indexFileContent"] }


      fetch(
        SERVER_URL_parsefunctions+"/uploadPythonFile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Parse-Application-Id": "what2study",
            "X-Parse-Master-Key": "what2studyMaster",
          },
          body: JSON.stringify(formData),
        }
      );
    }).catch((e) => {
      showNotification({
        type: 'error',
        title: 'Bitte überprüfen Sie den Dateinamen. Entfernen Sie Zahlen wie (1)* am Ende des Dateinamens, falls vorhanden.',
        message: '',
      })
    })
  }

  return (
    <PageContainer pageId='1'
      title='Wissensdatenbank'>
      <fieldset style={{ width: "100%" }}>
        <legend>Neues Wissen hinzufügen</legend>
        <Tabs
          defaultActiveKey="1"
          type="card"
          size={size}

          items={new Array(4).fill(null).map((_, i) => {
            const id = String(i + 1);
            return {
              label: <>{id == "1" ? <>Dateien</> : id == "2" ? <>Text</> : id == "3" ? <>Mediendateien</> : <>URL</>}</>,
              key: id,
              children: <>
                {id == "1" ?

                  <div style={{ background: "white", height: "380px", marginTop: "-13px", marginLeft: "2px", padding: "10px" }}>
                    <Row>
                      <Col span={14} style={{ marginTop: "20px" }}>
                        <Upload {...props} maxCount={1} listType='picture'>

                          <Button  style={{width:"450px", height:"150px", backgroundColor:"#fafafa", border:"dashed 0.3px"}} icon={<InboxOutlined style={{ fontSize: '350%', color:"#257dfe"}}/>}><br></br><span>Hochladen: Nur PDF-Dateien</span></Button>
                        </Upload>
                      </Col>
                      <Col span={3} >

                        <Form.Item label='Priorität' name='chatbotLanguage' style={{ marginTop: "10px" }}>
                          <Select
                            style={{ width: "100px" }}
                            placeholder="Select"
                            defaultValue={priority}
                            onChange={(value) => {
                              setPriority(value)
                            }}
                          >

                            <Option value='Hight'>Hoch</Option>
                            <Option value='Medium'>Mittel</Option>

                            <Option value='Low'>Niedrig</Option>

                          </Select>

                        </Form.Item>
                      </Col>
                      <Col span={4} >

                        <Form.Item label='Gültigkeit bis' name='chatbotLanguage' style={{ marginTop: "10px" }}>

                          <DatePicker defaultValue={dayjs(expires, monthFormat)} format={monthFormat} picker="month" onChange={(e, s) => {
                            console.log(s)
                            setExpiry(s)
                          }} />

                        </Form.Item>

                      </Col>
                      <Col span={2} >
                        <Form.Item name='' style={{ marginTop: "10px" }}>

                          <Button type="primary" icon={<SendOutlined />} onClick={(e) => {
                            setLoader(true)
                            submitKnowledgeBase("pdf")
                            
                          }}>
                            Hinzfügen
                          </Button>
                        </Form.Item>

                      </Col>
                    </Row>
                    <Row style={{ marginTop: "70px" }}>
                      <TagComponent saveCallback={(tagsArr) => {
                        setTagsArray(tagsArr)
                      }} />
                    </Row>
                    {loader == true && <Row style={{ justifyContent: "center" }}>

                      <div className="loader">
                        <Spin size="large" /><span> Upload in Bearbeitung</span>
                      </div>

                    </Row>}
                  </div>
                  : id == "2" ?




                    <div style={{ background: "white", height: "380px", marginTop: "-13px", marginLeft: "2px", padding: "10px" }}>
                      <Row>
                        <Col span={14} style={{ marginTop: "20px" }}>
                          <Upload {...propsText} maxCount={1} listType='text'>
                          <Button  style={{width:"450px", height:"150px", backgroundColor:"#fafafa", border:"dashed 0.3px"}} icon={<InboxOutlined style={{ fontSize: '350%', color:"#257dfe"}}/>}><br></br><span>Hochladen: Nur Textdateien</span></Button>
                        
                          </Upload>
                        </Col>
                        <Col span={3} >

                          <Form.Item label='Priorität' name='chatbotLanguage' style={{ marginTop: "10px" }}>
                            <Select
                              style={{ width: "100px" }}
                              placeholder="Select"
                              defaultValue={priority}
                              onChange={(value) => {
                                setPriority(value)
                              }}
                            >

                              <Option value='Hight'>Hoch</Option>
                              <Option value='Medium'>Mittel</Option>

                              <Option value='Low'>Niedrig</Option>

                            </Select>

                          </Form.Item>
                        </Col>
                        <Col span={4} >

                          <Form.Item label='Gültigkeit bis' name='chatbotLanguage' style={{ marginTop: "10px" }}>

                            <DatePicker defaultValue={dayjs(expires, monthFormat)} format={monthFormat} picker="month" onChange={(e, s) => {
                              setExpiry(s)
                            }} />

                          </Form.Item>

                        </Col>
                        <Col span={2} >
                          <Form.Item name='' style={{ marginTop: "10px" }}>

                            <Button type="primary" icon={<SendOutlined />} onClick={(e) => {
                              setLoader(true)

                              submitKnowledgeBase("text")
                            }}>
                              Hinzfügen
                            </Button>
                          </Form.Item>

                        </Col>
                      </Row>
                      <Row style={{ marginTop: "70px" }}>
                        <TagComponent saveCallback={(tagsArr) => {
                          setTagsArray(tagsArr)
                        }} />
                      </Row>
                      {loader == true && <Row style={{ justifyContent: "center" }}>

                        <div className="loader">
                          <Spin size="large" /><span> Upload in Bearbeitung</span>
                        </div>

                      </Row>}
                    </div> : id == "3" ?


                      <div style={{ background: "white", height: "550px", marginTop: "-13px", marginLeft: "2px", padding: "10px" }}>
                        <Row>
                          <Col span={14} style={{ marginTop: "20px" }}>
                            <Upload {...propsMedia} maxCount={1} listType='text'>
                            <Button  style={{width:"450px", height:"150px", backgroundColor:"#fafafa", border:"dashed 0.3px"}} icon={<InboxOutlined style={{ fontSize: '350%', color:"#257dfe"}}/>}><br></br><span>Hochladen: Nur Bilder und Videos (jpg, png, mp4)</span></Button>
                        
                            </Upload>
                          </Col>
                          <Col span={3} >

                            <Form.Item label='Priorität' name='chatbotLanguage' style={{ marginTop: "10px" }}>
                              <Select
                                style={{ width: "100px" }}
                                placeholder="Select"
                                defaultValue={priority}
                                onChange={(value) => {
                                  setPriority(value)
                                }}
                              >

                                <Option value='Hight'>Hoch</Option>
                                <Option value='Medium'>Mittel</Option>

                                <Option value='Low'>Niedrig</Option>

                              </Select>

                            </Form.Item>
                          </Col>
                          <Col span={4} >

                            <Form.Item label='Gültigkeit bis' name='chatbotLanguage' style={{ marginTop: "10px" }}>

                              <DatePicker defaultValue={dayjs(expires, monthFormat)} format={monthFormat} picker="month" onChange={(e, s) => {
                                setExpiry(s)
                              }} />

                            </Form.Item>

                          </Col>
                          <Col span={2} >
                            <Form.Item name='' style={{ marginTop: "10px" }}>

                              <Button type="primary" icon={<SendOutlined />} onClick={(e) => {
                                setLoader(true)

                                submitKnowledgeBase("media")
                              }}>
                                Hinzfügen
                              </Button>
                            </Form.Item>

                          </Col>
                        </Row>
                        <Row style={{ marginTop: "10px" }}>
                          <Form.Item name='Abschrift' label="Transkription/Beschreibung der Mediendatei" style={{ marginTop: "10px" }}>

                            <TextArea
                              onChange={(e) => setTranscript(e.target.value)}
                              placeholder=""
                              autoSize={{ minRows: 7, maxRows: 8 }}
                              style={{ width: "650px" }}
                            />
                          </Form.Item>

                        </Row>
                        <Row style={{ marginTop: "70px" }}>
                          <TagComponent saveCallback={(tagsArr) => {
                            setTagsArray(tagsArr)
                          }} />
                        </Row>
                        {loader == true && <Row style={{ justifyContent: "center" }}>

                          <div className="loader">
                            <Spin size="large" /><span> Upload in Bearbeitung</span>
                          </div>

                        </Row>}
                      </div> : <div style={{ background: "white", height: "450px", marginTop: "-13px", marginLeft: "2px", padding: "10px" }}>
                        <Row>
                          <Col span={14} style={{ marginTop: "20px" }}>

                          </Col>
                          <Col span={3} >

                            <Form.Item label='Priorität' name='chatbotLanguage' style={{ marginTop: "10px" }}>
                              <Select
                                style={{ width: "100px" }}
                                placeholder="Select"
                                defaultValue={priority}
                                onChange={(value) => {
                                  setPriority(value)
                                }}
                              >

                                <Option value='Hight'>Hoch</Option>
                                <Option value='Medium'>Mittel</Option>

                                <Option value='Low'>Niedrig</Option>

                              </Select>

                            </Form.Item>
                          </Col>
                          <Col span={4} >

                            <Form.Item label='Gültigkeit bis' name='chatbotLanguage' style={{ marginTop: "10px" }}>

                              <DatePicker defaultValue={dayjs(expires, monthFormat)} format={monthFormat} picker="month" onChange={(e, s) => {
                                setExpiry(s)
                              }} />

                            </Form.Item>

                          </Col>
                          <Col span={2} >
                            <Form.Item name='' style={{ marginTop: "10px" }}>

                              <Button type="primary" icon={<SendOutlined />} onClick={(e) => {
                                let formData = { url: urlCrawler }
                                setLoader(true)

                                const response = fetch(
                                  ServerCrawl,
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(formData),
                                  }
                                ).then(response => response.json())
                                  .then(data => {
                                    saveCrawlData(data)

                                  })
                                  .catch(error => console.error(error));;
                              }}>
                                Hinzfügen
                              </Button>
                            </Form.Item>

                          </Col>
                        </Row>
                        <Row>

                          <Col span={14} >


                            <Form.Item label='URL einer Webseite eingeben' name='crawlerUrl'
                            >
                              <Input
                                addonBefore="https://"
                                placeholder='university.de'
                                onChange={(e) => {
                                  var val: string = e.target.value

                                  if (e.target.value != "") {
                                    if (!val.includes("https://")) {
                                      val = "https://" + val
                                    }
                                  }
                                  setUrlCrawler(val)

                                }
                                }
                              />

                            </Form.Item>

                          </Col>
                        </Row>
                        {/* <Row style={{ marginTop: "10px" }}>
                          <Form.Item name='Abschrift' label="Web-Crawler Konfiguration" style={{ marginTop: "10px" }}>

                            <Checkbox>Hierarchische Abfrage (n+1)</Checkbox>
                          </Form.Item>

                        </Row> */}
                        <Row style={{ marginTop: "70px" }}>
                          <TagComponent saveCallback={(tagsArr) => {
                            setTagsArray(tagsArr)
                          }} />
                        </Row>
                        {loader == true && <Row style={{ justifyContent: "center" }}>

                          <div className="loader">
                            <Spin size="large" /><span> Upload in Bearbeitung</span>
                          </div>

                        </Row>}
                      </div>
                }
              </>,
            };
          })}
        />


      </fieldset>


      <fieldset style={{ width: "100%", marginTop: "100px" }}>
        <legend> Aktuelle Wissensdatenbank</legend>
        <>{tableJSX}</>


      </fieldset>
      {activeChatbotID && <ChatClient
        objectId={activeChatbotID}
        userId={curUserId}
        universityId={curUserId}
        accessToken={token}
        chatbotId={activeChatbotID}
      ></ChatClient>}
    </PageContainer >
  )
}

export default Overview
function createBrowserHistory(arg0: { basename: string }): History {
  throw new Error('Function not implemented.')
}

