import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { QuestionFormComponent } from './question-form/question-form.component';

export const routes: Routes = [
    { path: '', component: AppComponent, title: 'Home Page'}, // Default route
    { path: 'chatbot', component: ChatbotComponent, title: 'Chatbot' },  // Chatbot route
];
