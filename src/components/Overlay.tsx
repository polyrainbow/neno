
const Overlay = (props) => {
  return <div
    onClick={props.onClick}
    className="overlay"
  >
    {props.children}
  </div>;
};

export default Overlay;
