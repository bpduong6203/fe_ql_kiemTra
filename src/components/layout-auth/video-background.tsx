export default function VideoBackground () {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/login2.mp4" type="video/mp4" />
      </video>
    );
  }
  