import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './environment-overview-page.component.html'
})
export class EnvironmentOverviewPageComponent implements OnInit {
  projectId: string;
  environmentId: string;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('project_id');
    this.environmentId = this.route.snapshot.paramMap.get('environment_id');
  }
}
