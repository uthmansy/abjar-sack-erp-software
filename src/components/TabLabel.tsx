import { IconType } from "react-icons";

interface Props {
  label: string;
  Icon: IconType;
}

function TabLabel({ Icon, label }: Props) {
  return (
    <div className="font-semibold uppercase flex space-x-2 items-center">
      <Icon className="text-inherit opacity-50 text-xs scale-90" />
      <span>{label}</span>
    </div>
  );
}

export default TabLabel;
