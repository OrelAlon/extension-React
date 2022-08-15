import ReactLoading from "react-loading";

const Example = ({ type, color }) => (
  <ReactLoading
    className='spinner'
    type={"spinningBubbles"}
    color={"#fd6262"}
    height={"20%"}
    width={"20%"}
  />
);

export default Example;
