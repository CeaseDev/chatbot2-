import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface Message {
  text: string;
  isUser: boolean;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent implements OnInit {
  isOpen = false;
  userForm!: FormGroup;
  formSubmitted: boolean = false;
  @ViewChild('scrollMe') private myScrollContainer: any;
  finalquestion: boolean = false;
  userData: any = {
    name: '',
    ssn: '',
    dob: '',
    gender: '',
    email: '',
    mno: '',
    state: '',
    city: '',
    address: '',
    zipcode: '',
  };
  messages: any[] = [];
  currentQuestionIndex: number = 0;
  conversationFlow: any[] = [
    {
      question: 'Hi! I am Baymax, your insurance companion.',
    },
    {
      question: 'Can you please provide your SSN?',
      regex: /^(\d{3}-?\d{2}-?\d{4}|XXX-XX-XXXX)$/,
    },
    {
      question: 'Thank you , Can i have your Email address?',
      regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    {
      question: 'What is your First Name?',
      regex: /^([a-zA-Z \-\'])+[a-zA-Z]?$/,
    },
    {
      question: 'What is your Last Name?',
      regex: /^([a-zA-Z \-\'])+[a-zA-Z]?$/,
    },
    {
      question: 'Your Date of Birth',
      regex: /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/,
    },
    {
      question: 'Your Gender',
      regex: /^(?:m|M|male|Male|f|F|female|Female|Other|other)$/,
    },

    {
      question: 'Please provide Us with your Mobile Number ',
      regex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/,
    },
    {
      question: 'Enter the State you live in',
      regex: /^[a-zA-Z]+([a-zA-Z ]+)?$/,
    },
    { question: 'Enter your City', regex: /^[a-zA-Z -]+([a-zA-Z. ]+)?$/ },
    { question: 'Enter your Address', regex: /^[ A-Za-z0-9_@./#&+-]*$/ },
    {
      question: 'Enter your Communication Medium',
      regex: /^[ A-Za-z0-9_@./#&+-]*$/,
    },
    {
      question: 'ZipCode Please',
      regex: /(^\d{5}$)|(^\d{5}-\d{4}$)/,
      isFinalQuestion: true,
    },
    {
      question: 'Thank you for providing your information!',
    },
  ];
  validMessages: string[] = [];

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      userInput: ['', Validators.required],
    });
    this.askQuestion();
    this.currentQuestionIndex++;
    this.askQuestion();
  }
  handleEnterKey(event: any) {
    event.preventDefault(); // Prevent form submission

    if (event.key === 'Enter') {
      this.processUserResponse();
    }
  }
  clearChat(): void {
    this.messages = [];
    this.currentQuestionIndex = 0;
    this.formSubmitted = false;
    if (!this.finalquestion) {
      this.userData = {};
    } else {
      this.onCreateUser(this.userData);
      this.userData = {};
    }
    this.validMessages = [];
    this.userForm.reset();
    this.askQuestion();
    this.currentQuestionIndex++;
    this.askQuestion();
  }
  askQuestion(): void {
    const question = this.conversationFlow[this.currentQuestionIndex].question;
    this.messages.push({ text: question, isUser: false });
  }

  processUserResponse(): void {
    if (this.userForm.valid) {
      const userInput: string = this.userForm?.get('userInput')?.value;
      this.messages.push({ text: userInput, isUser: true });
      const currentQuestion = this.conversationFlow[this.currentQuestionIndex];
      const regex = currentQuestion.regex;
      this.scrollToBottom();
      if (regex && new RegExp(regex).test(userInput)) {
        this.validMessages.push(userInput);
      }
      if (regex && !new RegExp(regex).test(userInput)) {
        this.messages.push({
          text: 'Invalid input. Please try again.',
          isUser: false,
        });
      } else {
        if (currentQuestion.isFinalQuestion) {
          this.finalquestion = true;
          this.userData = {
            socialSecurityNumber: this.validMessages[0],
            email: this.validMessages[1],
            firstName: this.validMessages[2],
            lastName: this.validMessages[3],
            dob: this.validMessages[4],
            gender: this.validMessages[5],
            mobile: this.validMessages[6],
            state: this.validMessages[7],
            city: this.validMessages[8],
            address: this.validMessages[9],
            communicationMedium: this.validMessages[10],
            zipcode: this.validMessages[11],
          };
          this.currentQuestionIndex++;
          this.askQuestion();
        } else {
          this.currentQuestionIndex++;
          this.askQuestion();
        }
      }
      this.userForm.reset();
      this.scrollToBottom();
      console.log(this.userData);
      console.log(this.validMessages);
      this.onCreateUser(this.userData);
    }
  }

  openSupportPopup() {
    this.isOpen = !this.isOpen;
  }

  scrollToBottom() {
    setTimeout(() => {
      try {
        this.myScrollContainer.nativeElement.scrollTop =
          this.myScrollContainer.nativeElement.scrollHeight + 500;
      } catch (err) {}
    }, 10);
  }
  onCreateUser(creationData: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: number;
    communicationMedium: string;
    address: string;
    city: string;
    state: string;
    zipcode: number;
    dob: Date; // mm-dd-yyyy
    gender: string;
    socialSecurityNumber: number;
  }) {
    this.http
      .post('http://localhost:5000/users/add', creationData)
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }
}
