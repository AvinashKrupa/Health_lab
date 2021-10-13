
const ProfileButton = ({fontText,btnText, onClick, className,active, route}) => {
    return (
      <>
       <div style={{
            flexDirection: "row",
            display: "flex",
            background: active === route ? `rgba(${40}, ${163}, ${218}, ${0.2})` : ''
        }} className={'patient-profile-btn ' + className} onClick={onClick}>
             <i class={`fas ${fontText}`} style={{ marginTop: '4px', color:"#28A3DA"}}></i>
             <span style={{marginLeft: '15px', }}>{btnText}</span>
         </div>
      </>
    );
  };

  export default ProfileButton;

