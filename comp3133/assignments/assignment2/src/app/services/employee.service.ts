import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  GET_EMPLOYEES,
  GET_EMPLOYEE,
  SEARCH_EMPLOYEES,
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
} from '../graphql/operations';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getAll() {
    return this.apollo.watchQuery({
      query: GET_EMPLOYEES,
      fetchPolicy: 'network-only',
    });
  }

  getById(id: string) {
    return this.apollo.query({
      query: GET_EMPLOYEE,
      variables: { id },
      fetchPolicy: 'network-only',
    });
  }

  search(department?: string, designation?: string) {
    return this.apollo.query({
      query: SEARCH_EMPLOYEES,
      variables: { department, designation },
      fetchPolicy: 'network-only',
    });
  }

  add(data: any) {
    return this.apollo.mutate({
      mutation: ADD_EMPLOYEE,
      variables: data,
      refetchQueries: [{ query: GET_EMPLOYEES }],
    });
  }

  update(id: string, data: any) {
    return this.apollo.mutate({
      mutation: UPDATE_EMPLOYEE,
      variables: { id, ...data },
      refetchQueries: [{ query: GET_EMPLOYEES }],
    });
  }

  delete(id: string) {
    return this.apollo.mutate({
      mutation: DELETE_EMPLOYEE,
      variables: { id },
      refetchQueries: [{ query: GET_EMPLOYEES }],
    });
  }
}
