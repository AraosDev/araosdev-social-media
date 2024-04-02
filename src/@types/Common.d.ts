type valObj = { value: string; valueId: string | number };
interface AutoSuggestionProps {
  defaultValue: string;
  inputTypeProps: {
    caption: string;
    disabled?: boolean;
    inputTextFontSize: number;
    dropDownStyle: React.CSSProperties;
    placeholder?: string;
    label?: string;
    name?: string;
    captionStyle?: Record<string, string | number>;
  };
  totalList: 'LOADING' | 'EMPTY' | 'ERROR' | 'NOT_ENOUGH_LENGTH' | valObj[];
  onSuggestionClick: (valueObj: {
    value: string;
    valueId: string | number;
  }) => void;
  minLengthToShowSuggestion: number;
  onSearchKeyChange: (searchKey: string) => void;
  customListComponent?: (
    valueObj: valObj,
    onHoverFn: (obj: valObj) => void,
    className: string
  ) => React.ReactElement | JSX.Element | null;
  loaderMsg?: string;
  notEnoughTextLengthMsg?: string;
}

interface LoaderProps {
  message?: string;
  inlineText?: boolean;
  className?: string;
  noMsg?: boolean;
}

interface FormHeaderProps {
  hr?: boolean;
  inline?: boolean;
}

interface ModalCompProps {
  openModalState: boolean;
  onCloseModal: () => void;
  modalSize?: 'xl' | 'sm' | 'lg';
  header: string;
  modalBody: () => JSX.Element;
  validationMsg?: string;
  proceedHandler: () => void;
  proceedValidation: boolean;
  proceedLabel: string;
  bodyClass?: string;
}

interface ProfileIconProps {
  className?: string;
  iconBg?: string;
  iconSize?: string;
  iconTextColor?: string;
  iconText?: string;
  profileDp?: string;
  isOnline?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

interface AppButtonProps {
  children: JSX.Element | string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

interface AppToastProps {
  show: boolean;
  setShow: (show: AppToastProps['show']) => void;
  toastHeader: string;
  toastBody: string;
  toastPosition:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-center'
    | 'bottom-left';
}
