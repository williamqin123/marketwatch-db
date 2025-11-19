import { Button } from "./ui/button";

function Toast({
  message,
  variant,
  onOpenDetails,
}: {
  message: string;
  variant: "SUCCESS" | "FAIL";
  onOpenDetails: Function;
}) {
  return (
    <div
      className={`rounded p-4 mt-3 ${
        variant == "FAIL" ? "bg-red-100" : "bg-green-100"
      }`}
    >
      <div className="grid grid-cols-[1fr_auto] gap-5">
        <div
          className="font-medium text-foreground line-clamp-2"
          style={{ fontSize: "75%", textAlign: "start" }}
        >
          {message}
        </div>
        <Button type="button" onClick={() => onOpenDetails()}>
          Dev Details
        </Button>
      </div>
    </div>
  );
}

export default Toast;
