import React, {Component} from 'react';
import QrReader from 'react-qr-reader';
import {
   
    Card,  CardText, CardBody, CardFooter,
    CardHeader,Button, InputGroup, InputGroupAddon, Input,
    Modal, ModalHeader,ModalFooter, ModalBody
    } from 'reactstrap';
import QRCode from 'qrcode.react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import {SHA256, AES} from 'crypto-js';
class QRDownloader extends Component {
    constructor(props){
        super(props);

        var parsedArg = JSON.parse(atob(props.match.params.base64));
        
        
       this.state ={
           size: Number(props.match.params.size),
           data: parsedArg.base64,
           name:  props.match.params.name,
           stayopen: props.match.params.stayopen,
           is_encrypted : parsedArg.encrypted,
           sha256checksum: parsedArg.sha256checksum,
           given_password: "",
           downloaded: false,
           cameraOpen: false
       };
  }

  /*
  {
      encrypted: true/false,

  }

  */

  componentDidMount(){
    if(this.state.downloaded === false && this.state.encrypted === false){
        this.downloadQRCode();
        this.setState({downloaded: true})
        if(this.state.stayopen === 0 || this.state.stayopen === "0"){
            window.open('','_parent','');
            window.close();
        }
    }
  }
  

  downloadQRCode(){
    var lnk = document.createElement('a'), e;

    /// the key here is to set the download attribute of the a tag
    lnk.download = this.state.name;
  
    /// convert canvas content to data-uri for link. When download
    /// attribute is set the content pointed to by link will be
    /// pushed as "download" in HTML5 capable browsers
    var canvas = document.getElementById("qrcodeCanvas")
    lnk.href = canvas.toDataURL("image/png;base64");
  
    /// create a "fake" click-event to trigger the download
    if (document.createEvent) {
      e = document.createEvent("MouseEvents");
      e.initMouseEvent("click", true, true, window,
                       0, 0, 0, 0, 0, false, false, false,
                       false, 0, null);
  
      lnk.dispatchEvent(e);
    } else if (lnk.fireEvent) {
      lnk.fireEvent("onclick");
    }
}

decryptQR(){
    alert("password: " + this.state.given_password);
    alert(this.state.data);
    var decoded = atob(this.state.data);
    alert(decoded);
    
    var decrypted = AES.decrypt(decoded, this.state.given_password).toString();
    var decrypted2 = AES.decrypt(atob(decoded), this.state.given_password).toString();
    alert(decrypted2);
    //debugger;
    this.setState({
        is_encrypted: false,
        data: decrypted,
        cameraOpen: false
    });
    alert(decrypted);
    alert(atob(decrypted));
    //this.setState({cameraOpen:!this.state.cameraOpen});
    //this.toggleCamera();
}

valueChanged(what, event) {
    var update = {};
    update[what] = event.target.value;
    this.setState(update);
}

handleError(err){
    console.error(err)
  }
handleScan(data){
   
    if(data){
        alert(data);
             try {
                var parsed = JSON.parse(data);
                if(parsed.key && parsed.checksumValue){
                    var valueCheck = SHA256(AES.decrypt(parsed.checksumValue, parsed.key)).toString();
                    if(valueCheck === this.state.sha256checksum){
                        this.setState({given_password: parsed.key}, function() {
                            this.decryptQR();
                        });
                    }else{
                        alert(valueCheck + " != " + this.state.sha256checksum);
                    }
                }else{
                   
                    this.setState({given_password: "Not a valid QR code."})
                }
            } catch (e) {
                alert(e);
                alert(data);
                alert("Error happened, not working");
               
            }
        }
      
  }

toggleCamera(){
    this.setState({cameraOpen:!this.state.cameraOpen});
  }

    render(){
        return <div style={{display:'flex', textAlign:'center', 
            alignItems:'center', alignContent:'center',
            justifyContent:'center', width:'100%', height:'100vh'}}>
            <Card style={{minWidth:'300px'}}>           
              <CardHeader>Downloading QR Code: {this.state.name}</CardHeader>
              {this.state.is_encrypted ? 
              
                <CardBody>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <Button onClick={this.toggleCamera.bind(this)}>
                                <FontAwesomeIcon icon={faCamera}/>
                            </Button>
                        </InputGroupAddon>

                        <Input placeholder="key" type="password" value={this.state.given_password} 
                            onChange={this.valueChanged.bind(this, "given_password")}/>
                    </InputGroup>
                </CardBody>: 

              <CardBody>
                <QRCode id="qrcodeCanvas" 
                    value={atob(this.state.data)} 
                    size={this.state.size} />
                <CardText>
                {this.state.data} 
                    <hr/>
                    {atob(this.state.data)} 

                </CardText>
               
              </CardBody>
              }
              <CardFooter>
              {this.state.is_encrypted ? 
                  <Button onClick={this.decryptQR.bind(this)}>Decrypt</Button> : 
                  <Button onClick={this.downloadQRCode.bind(this)}>Download</Button>
              }
              </CardFooter>
            
        </Card>
        <Modal isOpen={this.state.cameraOpen} centered >
          <ModalHeader toggle={this.toggleCamera.bind(this)}>Read key</ModalHeader>
          <ModalBody>
            <QrReader 
                    delay={300}
                    onError={this.handleError.bind(this)}
                    onScan={this.handleScan.bind(this)}
                    style={{ width:'100%' }}>

                </QrReader>
           </ModalBody>
           <ModalFooter>

           </ModalFooter>
         
        </Modal>
        </div>
              
    }
}


export { QRDownloader as default}