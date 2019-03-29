import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './project-overview-page.component.html',
  styleUrls: ['./project-overview-page.component.scss']
})
export class ProjectOverviewPageComponent {
  projectId: string;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('project_id');
  }
}
