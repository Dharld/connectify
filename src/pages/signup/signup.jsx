import { useState } from "react";
import "./Signup.scss";
import { useToast } from "../../hooks/toast.hook";
import { useDispatch } from "react-redux";
import { signup } from "../../store/slices/auth/auth.actions";
import { useNavigate } from "react-router-dom";

const INITIAL_STATE = {
  email: "",
  password: "",
  confirmPassword: "",
  birthDate: "",
};

export default function Signup() {
  const [credentials, setCredentials] = useState(INITIAL_STATE);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { showError, showSuccess } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // If you want to preview the image immediately after selecting it
    const reader = new FileReader();
    reader.onload = function () {
      setImgPreview(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = credentials;
    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    dispatch(signup({ credentials, selectedFile }))
      .then(() => {
        showSuccess("Account created successfully");
        setCredentials(INITIAL_STATE);
        setSelectedFile(null);
        setImgPreview(null);
        navigate("/login");
      })
      .catch((err) => showError(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Signup</h1>
      <div className="input-profile-pic">
        <div>Profile Pic</div>
        {imgPreview && <img src={imgPreview} alt="Preview" />}
        <input
          type="file"
          accept="image/*"
          name="profileImage"
          onChange={handleFileChange}
        />
      </div>
      <div className="input">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={credentials.email}
          onChange={handleChange}
        />
      </div>
      <div className="input">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
        />
      </div>
      <div className="input">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={credentials.confirmPassword}
          onChange={handleChange}
        />
      </div>
      <div className="input">
        <label htmlFor="birthdate">Birthdate</label>
        <input
          type="date"
          name="birthDate"
          value={credentials.birthDate}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Signup</button>
    </form>
  );
}
