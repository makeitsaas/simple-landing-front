import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface Service {
  id: string;
  name: string;
  subpath: string;
}

interface Environment {
  id: string;
  domains: string[];
  services: Service[];
}

const environmentsMock: {[id: string]: Environment} = {
  1 : {
    id: '1',
    domains: [
      'project.makeitsaas.com',
    ],
    services: [
      {id: '1', name: 'Authentication', subpath: '/auth'},
      {id: '2', name: 'Subscriptions', subpath: '/subscription'},
      {id: '3', name: 'Custom', subpath: '/custom'}
    ]
  }
};

let NEXT_SERVICE_ID = 4;

/*domains = [
  'project.makeitsaas.com',
];

services = [
  {name: 'Authentication', subpath: '/auth'},
  {name: 'Subscriptions', subpath: '/subscription'},
  {name: 'Custom', subpath: '/custom'}
];*/

@Injectable()
export class EnvironmentService {

  private environments: {[id: string]: BehaviorSubject<Environment>} = {};

  constructor() {}

  getEnvironment(id: string): Observable<Environment> {
    if (!this.environments[id]) {
      const mockValue: Environment = environmentsMock[id] || this.generateMockEnvironment(id);
      this.environments[id] = new BehaviorSubject<Environment>(mockValue);
    }

    return this.environments[id].asObservable();
  }

  refreshEnvironment(id: string): void {
    this.environments[id].next(environmentsMock[id]);
  }

  addDomain(environmentId: string): Observable<any> {
    environmentsMock[environmentId].domains.push('some-other-domain.makeitsaas.com');
    this.refreshEnvironment(environmentId);
    return this.getEnvironment(environmentId);
  }

  addService(environmentId: string): Observable<any> {
    environmentsMock[environmentId].services.push(this.generateMockService());
    this.refreshEnvironment(environmentId);
    return this.getEnvironment(environmentId);
  }

  generateMockEnvironment(id: string): Environment {
    if (!environmentsMock[id]) {
      environmentsMock[id] = {
        id,
        domains: [
          `example-${id}.makeitsaas.com`
        ],
        services: [
          this.generateMockService()
        ]
      };
    }

    return environmentsMock[id];
  }

  generateMockService(): Service {
    const serviceId = `${NEXT_SERVICE_ID++}`;
    return {
      id: serviceId,
      name: 'Some service',
      subpath: `/path-${serviceId}`
    };
  }
}
