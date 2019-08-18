export class Issue {
  title: string;
  description: string;
  url: string;
  creationDate: Date;
  labels: [];
  author: {
    name: string;
    profile: string;
    avatar: string;
  }
  state: string;
  starred: boolean;
}
