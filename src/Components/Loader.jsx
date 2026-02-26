import loaderGif from "../assets/image/zb-animation-logo.gif";

export default function Loader() {
  return (
    <div className="m-auto">
      <img className="w-28 m-auto" src={loaderGif} alt="Loading…" />
    </div>
  );
}