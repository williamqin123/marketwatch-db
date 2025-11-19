import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Modal({ onCloseButtonClick, children }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: "#0005" }}
    >
      <Card>
        <CardHeader>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onCloseButtonClick()}
          >
            Close
          </Button>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}

export default Modal;
