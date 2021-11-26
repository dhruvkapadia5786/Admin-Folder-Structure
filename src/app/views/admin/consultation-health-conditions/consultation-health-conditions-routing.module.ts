import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';

import { ConsultationHealthConditionsComponent } from './consultation-health-conditions.component';
import { CreateHealthConditionsComponent } from './create-health-conditions/create-health-conditions.component';
import { EditHealthConditionsComponent } from './edit-health-conditions/edit-health-conditions.component';
import { ListHealthConditionsComponent } from './list-health-conditions/list-health-conditions.component';
import { ChangeSequenceComponent } from './change-sequence/change-sequence.component';


const routes: Routes = [
    { 
        path: '', component: ConsultationHealthConditionsComponent, canActivate : [AuthGuard],
        children:[
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            { path: 'list', component: ListHealthConditionsComponent },
            { path: 'create', component: CreateHealthConditionsComponent },
            { path: 'edit/:id', component: EditHealthConditionsComponent },
            { path: 'view/:condition_id', loadChildren:()=>import('./view-health-conditions/view-health-conditions.module').then(HCV => HCV.ViewHealthConditionsModule) }, 
            { path: 'manage-priority', component:ChangeSequenceComponent }
        ]
    }   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsultationHealthConditionsRoutingModule { }
