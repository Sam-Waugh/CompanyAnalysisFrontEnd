import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { QuestionFormComponent } from './question-form/question-form.component';
import { MatSidenavModule } from '@angular/material/sidenav';

export const routes: Routes = [
    { path: '', redirectTo: '/frontpage', pathMatch: 'full' }, // Default route
    //{ path: '', component: AppComponent, title: 'Home Page'}, // Default route
    { path: 'chatbot', component: ChatbotComponent, title: 'Chatbot' },  // Chatbot route
    { path: 'frontpage', component: FrontpageComponent, title: 'Frontpage' },  // Chatbot route
    { path: 'question', component: QuestionFormComponent, title: 'Question'} //question route
];
