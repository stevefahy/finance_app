export interface HintMessages {
  message: string;
  icon?: string;
  name: string;
}

export const HINT_MESSAGES: HintMessages[] = [
  {
    message: 'Add a Stock',
    icon: 'hint_green_arrow.png',
    name: 'stocks',
  },
  {
    message: 'Add an Account',
    icon: 'hint_green_arrow.png',
    name: 'accounts',
  },
  {
    message: 'Add a Tax',
    icon: 'hint_green_arrow.png',
    name: 'taxs',
  },
];
