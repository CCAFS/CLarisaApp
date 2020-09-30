import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { InnovationsPageComponent } from './pages/innovations-page/innovations-page.component';
import { CgiarEntityPageComponent } from './pages/cgiar-entity-page/cgiar-entity-page.component';
import { InstitutionsComponent } from './pages/institutions/institutions.component';

const routes: Routes = [
  { path: '', component: InstitutionsComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'institutions', component: InstitutionsComponent },
  { path: 'publications:entityAcronym', component: CgiarEntityPageComponent },
  { path: 'publications:entityAcronym/addInnovation', component: InnovationsPageComponent },
  { path: 'publications:entityAcronym/innovation/:id', component: InnovationsPageComponent },
  { path: '**', component: HomePageComponent },
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

