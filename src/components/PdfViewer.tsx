import {
  CloseOutlined,
  CopyOutlined,
  InboxOutlined,
  SmileFilled,
  SmileOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Input,
  InputNumber,
  List,
  Row,
  Tag,
  Typography,
  Upload,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const { Paragraph } = Typography;

export const PdfViewer: React.FC = () => {
  const [isPdfAvailable, setIsPdfAvailable] = useState(false);

  const [pageNumberInit, setPageNumber] = useState(1);
  const [selectedLocations, setSelectedLocations] = useState<
    {
      pageNumber: string |null;
      pageX: number;
      pageY: number;
      label: string;
      fontSize: number | null;
      checked: boolean;
    }[]
  >([]);
  const [numberOfpages, setNumberOfpages] = useState(0);
  const [pdfFile, setPdfFile] = useState(null);
  // const [checked, setChecked] = useState(true);

  const checkKey = (e: any) => {
    e = e || window.event;
    if (e.keyCode == "37") {
      if (pageNumberInit > 1) setPageNumber(pageNumberInit - 1);
    } else if (e.keyCode == "39") {
      if (pageNumberInit < numberOfpages) setPageNumber(pageNumberInit + 1);
    }
  };
  document.onkeydown = checkKey;
  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumberOfpages(numPages);
    setPageNumber(1);
  };

  const handleClick = (event: { pageX: any; pageY: any }) => {
    const { pageX, pageY } = event;
    setSelectedLocations([
      ...selectedLocations,
      {
        pageX,
        pageY,
        pageNumber: String(pageNumberInit - 1),
        label: "",
        fontSize: 11,
        checked: true,
      },
    ]);
  };

  const addLabelToElement = (label: string, index: number) => {
    const updatedLocations = [...selectedLocations];

    updatedLocations[index] = {
      ...updatedLocations[index],
      label: label,
    };

    setSelectedLocations(updatedLocations);
  };
  const addCheckBox = (e: any, index: number) => {
    const updatedLocations = [...selectedLocations];

    updatedLocations[index] = {
      ...updatedLocations[index],
      checked: e.target.checked,
    };

    setSelectedLocations(updatedLocations);
  };

  

    const addPageRangeToElement = (pageRange: string | null, index: number) => {
      const updatedLocations = [...selectedLocations];

      updatedLocations[index] = {
        ...updatedLocations[index],
        pageNumber: pageRange,
      };

      setSelectedLocations(updatedLocations);
    };
  const addFontSizeToElement = (fontSize: number | null, index: number) => {
    console.log("fontSize :", fontSize);
    const updatedLocations = [...selectedLocations];

    updatedLocations[index] = {
      ...updatedLocations[index],
      fontSize: fontSize,
    };

    setSelectedLocations(updatedLocations);
  };

  const removeElement = (index: number) => {
    const updatedLocations = [...selectedLocations];

    updatedLocations.splice(index, 1);

    setSelectedLocations(updatedLocations);
  };

  const generateText = () => {
    let initString = "";
    selectedLocations.forEach((item) => {
      if (item.checked) {
        initString =
          initString +
          `${item.pageX};${item.pageY};${item.pageNumber};` +
          '${record.getCellValue("' +
          item.label +
          '").name};' +
          item.fontSize +
          ";Calibri|";
      } else {
        initString =
          initString +
          `${item.pageX};${item.pageY};${item.pageNumber};` +
          '${record.getCellValue("' +
          item.label +
          '")};' +
          item.fontSize +
          ";Calibri|";
      }
    });
    return initString;
  };

  const handlePdfUpload = (file: Blob) => {
    const fileReader: any = new FileReader();
    fileReader.onload = async () => {
      await setPdfFile(fileReader.result);
      setIsPdfAvailable(true);
      message.success("PDF uploaded successfully!");
    };
    fileReader.readAsDataURL(file);
  };

  return (
    <>
      {!isPdfAvailable && !pdfFile ? (
        <>
          <div>
            <Upload
              accept=".pdf"
              multiple={false}
              beforeUpload={(file) => {
                handlePdfUpload(file);
                return false; // Prevent automatic upload
              }}
            >
              <button>Choose PDF</button>
            </Upload>
          </div>
        </>
      ) : (
        <Row justify={"center"}>
          <Col span={11}>
            <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
              <Page
                pageNumber={pageNumberInit}
                renderAnnotationLayer={false}
                onClick={handleClick}
              />
            </Document>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Row style={{ marginBottom: 36 }}>
              <Col span={24}>
                <List
                  header={<div>Selected locations</div>}
                  footer={<div>Footer</div>}
                  bordered
                  dataSource={selectedLocations}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Col span={8}>
                        <Input
                          value={item.label}
                          placeholder="add key"
                          onChange={(e) =>
                            addLabelToElement(e.target.value, index)
                          }
                        />
                      </Col>
                      <Col span={4}>
                        <Input
                          value={String(item.pageNumber)}
                          placeholder="pageRange"
                          onChange={(e) =>
                            addPageRangeToElement(e.target.value, index)
                          }
                        />
                      </Col>
                      <Col span={4}>
                        <InputNumber
                          max={50}
                          value={item.fontSize}
                          placeholder="fontSize"
                          defaultValue={11}
                          onChange={(e) => addFontSizeToElement(e, index)}
                        />
                      </Col>

                      <Col  style={{marginLeft:12}} span={6}>
                        <Checkbox
                          checked={item.checked}
                          onChange={(e) => addCheckBox(e, index)}
                        >
                          Is string
                        </Checkbox>
                      </Col>
                      <Col   span={2}>
                        <CloseOutlined onClick={() => removeElement(index)} />
                      </Col>
                    </List.Item>
                  )}
                />
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col span={20}>
                <Card
                  title="Generated string"
                  // style={{ width: 300 }}
                >
                  <Paragraph
                    style={{}}
                    copyable={{
                      icon: [
                        <CopyOutlined
                          style={{ fontSize: 24 }}
                          key="copy-icon"
                        />,
                        <CopyOutlined
                          style={{ fontSize: 24 }}
                          key="copied-icon"
                        />,
                      ],
                      tooltips: ["click here", "you clicked!!"],
                    }}
                  >
                    {generateText()}
                  </Paragraph>
                </Card>
              </Col>
            </Row>
            {/* {selectedLocations.map((el) => (
            <Tag
              closable
              // onClose={log}
            >
              {el.label}{" "}
            </Tag>
          ))} */}
          </Col>
        </Row>
      )}
    </>
  );
};
