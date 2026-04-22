export default function AnnouncementBanner({ reverse = false }) {
  return (
    <div className={`scroll-banner${reverse ? " reverse-banner" : ""}`}>
      <div className="scroll-content">
        CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL
        1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM -
      </div>
    </div>
  );
}
