import { styles } from "../styles/style";
import React, { FC, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useSelector } from "react-redux";
import axios from 'axios'
import { useNavigate } from "react-router-dom";


type Props = {
  setRoute: (route: string) => void;
};

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Verification: FC<Props> = ({ setRoute }) => {
  const { token } = useSelector((state: any) => state.user);
  console.log(token);

  const [invalidError, setInvalidError] = useState<boolean>(false);

  const navigate = useNavigate();



  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");
    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }

    console.log(verificationNumber);

    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_SERVER_PORT}/user/activate-user`, {
        activation_token: token,
        activation_code: verificationNumber,
      });

      // Kiểm tra response từ server
      if (response.data.success) {
        toast.success("Account activated successfully");
        navigate("/login")
      } else {
        toast.error(response.data.notification || "Error activating account");
      }
    } catch (error: any) {
      // Xử lý lỗi từ server
      console.error('Error activating account:', error.message);
      toast.error("Error activating account");
    }
  };

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <div>
      <h1 className={`${styles.title}`}>Verify Your Account</h1>
      <br />
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.5rem' }}>
        <div style={{ width: '10rem', height: '10rem', borderRadius: '9999px', backgroundColor: '#497DF2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <VscWorkspaceTrusted size={40} />
        </div>
      </div>
      <br />
      <br />
      <div style={{ margin: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="number"
            key={key}
            ref={inputRefs[index]}
            style={{ width: '12.25rem', height: '12.25rem', backgroundColor: 'transparent', borderWidth: '0.75rem', borderRadius: '2.5rem', display: 'flex', alignItems: 'center', color: 'black', dark: { color: 'white' }, justifyContent: 'center', fontSize: '18px', fontFamily: 'Poppins', outline: 'none', textAlign: 'center', borderColor: invalidError ? 'red' : 'black', dark: { borderColor: 'white' } }}
            placeholder=""
            maxLength={1}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
      <br />
      <br />
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <button style={{
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          padding: '15px 32px',
          textAlign: 'center',
          textDecoration: 'none',
          display: 'inline-block',
          fontSize: '16px',
          margin: '4px 2px',
          cursor: 'pointer',
          transitionDuration: '0.4s',
        }}
          onClick={verificationHandler}
          onMouseOver={(e) => e.target.style.backgroundColor = "#0069D9"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#007BFF"} >
          Verify OTP
        </button>
      </div>
      <br />
      <h5 style={{ textAlign: 'center', paddingTop: '1rem', fontFamily: 'Poppins', fontSize: '14px', color: 'black', dark: { color: 'white' } }}>
        Go back to sign in?{" "}
        <span
          style={{ color: '#2190ff', paddingLeft: '0.25rem', cursor: 'pointer' }}
          onClick={() => setRoute("Login")}
        >
          Sign in
        </span>
      </h5>
    </div>
  );
};

export default Verification; 