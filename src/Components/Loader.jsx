import loaderGif from "../assets/image/zb-animation-logo.gif";

export default function Loader() {
  return (
    <div className="">
      <img className="w-28" src={loaderGif} alt="Loading…" />
    </div>
  );
}
