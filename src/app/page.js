"use client"
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
// import { useAdminAccountQuery } from "../services/query";
import { useAdminAccountQuery } from "./services/query";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
// import './deposit.css'
const Home = () => {
  const cookies = new Cookies();
  const token = cookies.get("token"); 
  // const [Data ,setData]=useState()
  // const toast = useToast();
  const { data: Data } = useAdminAccountQuery()
  const [activeUser, setActiveUser] = useState(null);
  // const [Data, setData] = useState();
  const [activeTab, setActiveTab] = useState(0);
  const [Accdata, setaccData] = useState();
  const [qr, setQr] = useState();
  const [activeAccount, setActiveAccount] = useState()
  const [qr1, setQr1] = useState();
  const [Data1, setData1] = useState();
  const [formData, setFormData] = useState({
    amount: "",
    attachment: null,
    description: "",
    reason: "",
    type: "D", // default to Deposit
    status: "P", // default to Pending
    account_phone_number: "",
    account_ifsc_code: "",
    account_holder_name: "",
    unique_transaction_id: "",
    deposit_withdraw_type: "",
  });


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.unique_transaction_id === "") {
      Swal.fire({
        icon: 'info',
        text: "UTR ID is Required"
      })

      return; // Added return to stop the function if condition is met
    }

    if (formData.amount === "") {
      Swal.fire({
        icon: 'info',
        text: "Amount is Required"
      })

      return; // Added return to stop the function if condition is met
    }

    const binaryFormData = new FormData()
    binaryFormData.append("unique_transaction_id", formData?.unique_transaction_id)
    binaryFormData.append('amount', formData?.amount)
    
    if (formData.file) {
      binaryFormData.append('file', formData.file)
    }
    else{
      Swal.fire({
        text:"Please Send screenshot of payment",
        icon:'warning'
      })
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/deposit",
        binaryFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token}`,
          },
        }
      );
if(response.status==201){
  Swal.fire({
    title:'Success',
    icon:'success'
  })
}
      toast.success("Successful, wait sometime", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

    } 
    catch (error) {
      toast.error("Error fetching data", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      console.error("Error fetching data:", error);
    }

  };


  // Function to update the form data when an amount is selected
  const handleAmountSelect = (amount) => {
    setFormData({
      ...formData,
      amount,
    });
  };



  useEffect(() => {
    
  }, []);




  // Handler to update the active tab
  const handleTabClick = (index, user) => {
    setActiveUser(user)
    setActiveTab(index);
  };

  const downloadImage = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'payment-image';  // You can customize the default filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleCopy = (copyValue) => {
    navigator.clipboard.writeText(copyValue)
      .then(() => {
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };
  useEffect(() => {
    if(Data?.length){

      setActiveUser(Data[0].accounts[0])
    }   
  }, [Data])
  
useEffect(()=>{
console.log({formData})
},[formData])

  return (
    <>
      <div className="px-5" >
        <div className="container-fluid  pt-3   withdraw-shell">
          <div className="deposit p-3   rounded  ">
          <ul
  style={{ justifyContent: 'space-evenly', backgroundColor: 'blue' }}
  className="nav nav-pills py-3 rounded tab2"
  id="pills-tab"
  role="tablist"
>             
              {Data && Data.map((item, index) => (
                <div key={index}>
                  {item.accounts.map((user, ind) => (
                    <li className="nav-item" role="presentation" key={ind}>
                      <div
                        className={`btn btn-secondary ${activeTab === index ? 'active' : ''}`}
                        id={`pills-op${index}-tab`}
                        data-bs-toggle="pill"
                        data-bs-target={`#pills-op${index}`}
                        type="button"
                        role="tab"
                        aria-controls={`pills-op${index}`}
                        aria-selected={activeTab === index}
                        onClick={() => handleTabClick(index, user)}
                        onMouseEnter={e => e.target.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                        style={{ backgroundColor: 'white', color: 'black' }}
                      >
                        {user.account_holder_name}
                      </div>
                    </li>
                  ))}
                </div>
              ))}
            </ul>
            <div className="row mt-2  justify-content-center ">
              <div className="col-md-10">
                <div className="row border ">
                  <div className="col-md-5 px-md-4 border-end tab3 border">
                    <div>
                      <div class="tab-content" id="pills-tabContent">
                        {activeUser && Object.keys(activeUser).length ?
                          <>
                            <div className="st_blog_detail_thumb">
                              <div className="st_featured_thumb">
                                <div className="qr-section">
                                  <div className="bb_overall_transfer">
                                    <div>
                                      <div className="bb_tran_subdiv">
                                        <img src={activeUser?.qr_attachment} alt="" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="text_wrper">
                                  <div className="bb_transfer_div">

                                    <div className="bb_transfer_subsection"  style={{   color : "white"}}  >
                                      {activeUser?.upi_id ? (
                                        <div className="sectionList">
                                          <div className="bb_tran_subdiv">
                                            <div className="bb_bank_name">
                                              UPI ID:</div>
                                          </div>
                                          <div copy_value={activeUser?.upi_id} className="bb_copy_txt" onClick={() => handleCopy(activeUser?.upi_id)}>
                                            <div className="bb_tran_subdiv_sec">
                                              {activeUser?.upi_id}
                                            </div>
                                            <img
                                              className="click_btn"
                                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/220px-QR_code_for_mobile_English_Wikipedia.svg.png"
                                              style={{ backgroundColor: 'white', padding: '5px', borderRadius: '5px' }} 
                                            />
                                          </div>
                                        </div>
                                      ) : null}
                                      {activeUser?.account_number ? (
                                        <div className="sectionList">
                                          <div className="bb_tran_subdiv">
                                            <div className="bb_bank_name">Account Number:</div>
                                          </div>
                                          <div className="bb_copy_txt" onClick={() => handleCopy(activeUser?.account_phone_number)}>
                                            <div className="bb_tran_subdiv_sec">
                                              {activeUser?.account_number}
                                            </div>
                                            <img
                                              className="click_btn"
                                              src="https://dqqdyv927mezc.cloudfront.net/kheloyar/copy.svg"
                                            />
                                          </div>
                                        </div>
                                      ) : null}

                                      <div className="sectionList">
                                        <div className="bb_tran_subdiv">
                                          <div className="bb_bank_name">Account Holder Name:</div>
                                        </div>
                                        <div copy_value="WASHETTE SERVICES OPC PVT LTD" className="bb_copy_txt" onClick={() => handleCopy(activeUser?.account_holder_name)}>
                                          <div className="bb_tran_subdiv_sec">
                                            {activeUser?.account_holder_name}
                                          </div>
                                          
                                          <img
                                            className="click_btn"
                                            src="https://dqqdyv927mezc.cloudfront.net/kheloyar/copy.svg"
                                            
                                          />
                                        </div>
                                      </div>
                                      {activeUser?.bank_name ? (
                                        <div className="sectionList">
                                          <div className="bb_tran_subdiv">
                                            <div className="bb_bank_name">Bank Name:</div>
                                          </div>
                                          <div copy_value="YES BANK" className="bb_copy_txt" onClick={() => handleCopy(activeUser?.bank_name)}>
                                            <div className="bb_tran_subdiv_sec">
                                              {activeUser?.bank_name}
                                            </div>
                                            <img
                                              className="click_btn"
                                              src="https://dqqdyv927mezc.cloudfront.net/kheloyar/copy.svg"
                                            />
                                          </div>
                                        </div>
                                      ) : null}
                                      {activeUser?.ifsc ? (
                                        <div className="sectionList">
                                          <div className="bb_tran_subdiv">
                                            <div className="bb_bank_name">IFSC Code:</div>
                                          </div>
                                          <div copy_value="YESB0000444" className="bb_copy_txt" onClick={() => handleCopy(activeUser?.account_ifsc_code)}>
                                            <div className="bb_tran_subdiv_sec">
                                              {activeUser?.ifsc}
                                            </div>
                                            <img
                                              className="click_btn"
                                              src="https://dqqdyv927mezc.cloudfront.net/kheloyar/copy.svg"
                                            />
                                          </div>
                                        </div>
                                      ) : null}

                                      {activeUser?.phone_number ? (
                                        <div className="sectionList">
                                          <div className="bb_tran_subdiv">
                                            <div className="bb_bank_name">Number:</div>
                                          </div>
                                          <div copy_value="YESB0000444" className="bb_copy_txt" onClick={() => handleCopy(activeUser?.phone_number)}>
                                            <div className="bb_tran_subdiv_sec">
                                              {activeUser?.phone_number}
                                            </div>
                                            <img
                                              className="click_btn"
                                              src="https://dqqdyv927mezc.cloudfront.net/kheloyar/copy.svg"
                                            />
                                          </div>
                                        </div>
                                      ) : null}
                                    </div>

                                  </div>
                                </div>
                              </div>
                            </div>
                         
                          </>:null

                        }
                        <div
                          class="tab-pane fade "
                          id="pills-op2"
                          role="tabpanel"
                          aria-labelledby="pills-op2-tab"
                          tabindex="1"
                        >
                          <div className="st_blog_detail_thumb">
                            <div className="st_featured_thumb">
                              <div className="qr-section">
                                <div className="bb_overall_transfer">
                                  <div>
                                    <div className="bb_tran_subdiv">
                                      <img src={`	https://admin.1xbetindia.co//storage/app/public/payment/${qr1}`} alt="" />
                                    </div>
                                  </div>
                                  <div className="download_btn_wrapper">
                                    <button type="button" appdownloadimage="">
                                      Download &amp; Pay
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="text_wrper">
                                <div className="bb_transfer_div">
                                  {/* {Data &&
                                    Data.slice(0, 1).map((item, index) => ( */}
                                  <div className="bb_transfer_subsection">
                                    <div className="sectionList">
                                      <div className="bb_tran_subdiv">
                                        <div className="bb_bank_name">
                                          Account Number:
                                        </div>
                                      </div>
                                      <div className="bb_copy_txt">
                                        <div className="bb_tran_subdiv_sec">
                                          {activeUser?.account_phone_number}
                                        </div>
                                        <img
                                          className="click_btn"
                                          src="https://dqqdyv927mezc.cloudfront.net/kheloyar/copy.svg"
                                        />
                                      </div>
                                    </div>
                                    <div className="sectionList">
                                      <div className="bb_tran_subdiv">
                                        <div className="bb_bank_name">
                                          Account Holder Name:
                                        </div>
                                      </div>
                                      <div
                                        copy_value="WASHETTE SERVICES OPC PVT LTD"
                                        className="bb_copy_txt"
                                      >
                                        <div className="bb_tran_subdiv_sec">
                                          {activeUser?.account_holder_name}
                                        </div>
                                        <img
                                          className="click_btn"
                                          src="https://dqqdyv927mezc.cloudfront.net/kheloyar/copy.svg"
                                        />
                                      </div>
                                    </div>
                                    <div className="sectionList">
                                      <div className="bb_tran_subdiv">
                                        <div className="bb_bank_name">
                                          Bank Name:
                                        </div>
                                      </div>
                                      <div
                                        copy_value="YES BANK"
                                        className="bb_copy_txt"
                                      >
                                        <div className="bb_tran_subdiv_sec">
                                          {activeUser?.bank_name}
                                        </div>
                                        <img
                                          className="click_btn"
                                          src="https://dqqdyv927mezc.cloudfront.net/kheloyar/copy.svg"
                                        />
                                      </div>
                                    </div>
                                    <div className="sectionList">
                                      <div className="bb_tran_subdiv">
                                        <div className="bb_bank_name">
                                          IFSC Code:
                                        </div>
                                      </div>
                                      <div
                                        copy_value="YESB0000444"
                                        className="bb_copy_txt"
                                      >
                                        <div className="bb_tran_subdiv_sec">
                                          {activeUser?.account_ifsc_code}
                                        </div>
                                        <img
                                          className="click_btn"
                                          src="https://dqqdyv927mezc.cloudfront.net/kheloyar/copy.svg"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  {/* ))} */}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-7 px-md-4">
                    <form
                      className="p-4 border rounded filter-form tab3 text-white"
                      onSubmit={handleSubmit}
                    >
                      <div className="row">
                        {/* Upload File */}
                        <div className="col-md-12">
                          <label className="p-0" htmlFor="fileUpload">
                            Upload File
                          </label>
                          <div className="input-group mb-3">
                            <input
                              id="file_upload"
                              type="file"
                              // value={formData.attachment}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  file: e.target.files[0],
                                })
                              }
                              className="form-control"

                            />
                          </div>
                        </div>
                        {/* Amount */}
                        <div className="col-md-12">
                          <label className="p-0">Amount</label>
                          <div className="input-group mb-3">
                            <input
                              type="number"
                              className="form-control"
                              value={formData.amount}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  amount: Number(e.target.value),
                                })}

                              placeholder="Amount"
                            />
                          </div>
                          {/* Quick Amounts */}
                          <div className="month_tab">
                            {[
                              500, 1000, 2000, 5000
                            ].map((amount, index) => (
                              <div
                                className="quick_amt offline_amount label2 btn btn-secondary mx-2 border"
                                key={index}
                                onClick={() => handleAmountSelect(amount)}
                              >
                                {`+${amount}`}
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Unique Transaction Reference */}
                        <div className="col-md-12">
                          <label className="p-0" htmlFor="transaction_id">
                            Unique Transaction Reference
                          </label>
                          <div className="input-group mb-3">
                            <input
                              id="transaction_id"
                              type="text"
                              className="form-control"
                              value={formData.unique_transaction_id}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  unique_transaction_id: e.target.value,
                                })
                              }
                              placeholder="6 to 12 Digits UTR Number"
                              maxLength={20}
                            />
                          </div>
                        </div>
                        {/* Submit Button */}
                        <div className="col-md-12 ">
                          <button
                            type="submit"
                            className="btn submit-btn w-100 " 
                            onClick={handleSubmit}
                            style={{
                              // backgroundColor : 'blue' ,
                              color : 'white'
                            }}
                          >
                            Submit
                          </button>
                        </div>
                        <div className="note_wrapper my-4"  style={{ color : 'white' , 
                          //  background : 'blue'
                           }} >
                            <span> Please Note: </span>
                            <ul className="ps-md-0 ps-4" style={{ listStyleType: 'none' }} >
                              <li>
                                Deposit money only in the above available
                                account to get the fastest credit &amp; avoid
                                possible delays.
                              </li>
                              <li>
                                After Deposit, upload your deposit slip
                                screenshot to receive balance.
                              </li>
                              <li>
                                Requested amount should be the same as deposit
                                slip amount for smooth deposit process.
                              </li>
                              <li>
                                NEFT receiving time is from 40 -50 minutes.
                              </li>
                            </ul>
                          </div>
                      </div>
                    </form>

                    <div className="p-3 border rounded d-none mt-3">
                      <h6 className="text-white mb-3">
                        How to Deposit through UPI? (Hindi)
                      </h6>
                      <div className="text-center">
                        <img
                          src="https://dqqdyv927mezc.cloudfront.net/kheloyar/dep1.png"
                          alt=""
                        />
                      </div>
                    </div>

                    <div className="p-3 border rounded d-none mt-3">
                      <h6 className="text-white mb-3">
                        How to Deposit through UPI? (Hindi)
                      </h6>
                      <div className="text-center">
                        <img
                          src="https://dqqdyv927mezc.cloudfront.net/kheloyar/dep1.png"
                          alt=""
                        />
                      </div>
                    </div>

                    <div className="rounded d-none mt-3">
                      <h6 className="text-white mb-3">Notes</h6>
                      <div className="notesLine">
                        <img
                          className="dotLine"
                          src="https://dqqdyv927mezc.cloudfront.net/kheloyar/line-dotted.svg"
                        />
                        <div className="notesData">
                          <span>
                            Send your deposit amount on given Bank account.
                          </span>
                          <span>Copy and Enter the 12 digits UTR Number.</span>
                          <div className="links d-none d-sm-none d-md-flex">
                            <img
                              alt="no"
                              src="https://dqqdyv927mezc.cloudfront.net/kheloyar/utr.svg"
                            />
                            <img
                              alt="no"
                              src="https://dqqdyv927mezc.cloudfront.net/kheloyar/utr.svg"
                            />
                            <img
                              alt="no"
                              src="https://dqqdyv927mezc.cloudfront.net/kheloyar/utr.svg"
                            />
                          </div>
                          <span>
                            Submit the form &amp; Receive credits instantly.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}


export default Home
