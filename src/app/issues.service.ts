import { Injectable } from '@angular/core';
import { Issue } from './api/issue.class';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {

  constructor(private httpClient: HttpClient) { }

  getOptions = (searchString: string) => {
    const options = { headers: null, params: null };
    options.headers = new HttpHeaders({ 'Content-Type': 'application/json'} );
    options.params = this.getParams(searchString);
    return options;
  }

  getParams = (searchString: string): HttpParams => {
    let  params = new HttpParams();
    if (searchString && searchString.length > 1) {
      params = params.append('q', searchString);
    }
    return params;
  }

  getIssues = (searchString: string): Observable<Issue[]> =>
    this.httpClient.get<any>('https://api.github.com/search/issues', this.getOptions(searchString))
      .pipe(
        map((issues) => issues.items),
        map((issues) => {
          let mappedIssues = _.map(issues, (issue) => {
            const internalIssue = new Issue();
            internalIssue.title = issue.title;
            internalIssue.description = issue.body;
            internalIssue.creationDate = issue.created_at;
            internalIssue.starred = false;
            internalIssue.labels = issue.labels;
            internalIssue.url = issue.html_url;
            internalIssue.author = {
              name: issue.user.login,
              profile: issue.user.url,
              avatar: issue.user.avatar_url,
            };
            internalIssue.state = issue.state;
            return internalIssue;
          });
          mappedIssues = _.filter(mappedIssues, (issue) => issue.state === 'open');
          return mappedIssues;
        }),
      )
}
