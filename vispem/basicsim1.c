/* External definitions for single-server queueing system.*/

/* 
 * comment detail lihat di index.pdf
 * 
 * copas aja dari :
 * mcgrawhill simulation modeling & analysis
 * averill m.law & w.david kelton
 * 
 * 
 * */
 
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
//#include "rand.h" /* Header file for random-number-generator.*/
#define Q_LIMIT 100 /* Limit on queue length. */
#define BUSY 1 /*Mnemonics for server's being busy*/
#define IDLE 0 /*and idle. */

//funcs
void initialize(void);
void timing(void);
void arrive(void);
void depart(void);
void report(void);
void update_time_avg_stats(void);
float expon(float mean);

//vars
int next_event_type, 
num_custs_delayed, 
num_delays_required, 
num_events, 
num_in_q, 
server_status;

float area_num_in_q, 
area_server_status, 
mean_interarrival, 
mean_service, 
time, 
time_arrival[Q_LIMIT + 1], 
time_last_event, 
time_next_event[3], 
total_of_delays;

FILE *infile, *outfile;

void initialize(void){
	time=0.0;
	server_status=IDLE;
	num_in_q = 0;
	time_last_event=0.0;
	
	num_custs_delayed=0;
	total_of_delays=0.0;
	area_num_in_q=0;
	area_server_status=0;
	
	time_next_event[1]=time+expon(mean_interarrival);
	time_next_event[2]=1.0e+30;
}

void timing(){
	int i;
	float min_time_next_event=1.0e+29;
	
	next_event_type=0;
	
	for(i=1;i<=num_events;++i){
		if(time_next_event[i]<min_time_next_event){
			min_time_next_event=time_next_event[i];
			next_event_type=i;
		}
	}
	
	if(next_event_type==0){
		fprintf(outfile,"\nEvent list empty at time %f",time);
		exit(1);
	}
	time=min_time_next_event;
}

void arrive(void){
	float delay;
	time_next_event[1]=time+expon(mean_interarrival);
	
	printf("subjek masuk sys : q=%d\n",num_in_q);
	if(server_status==BUSY){
		++num_in_q;
		
		if(num_in_q>Q_LIMIT){
			//the q has overflowed so stop the sim
			//kalo antriannya overflow, simulasi berhenti
			char c[40]="arr : overflow arr timearr at time ";
			printf("%s %f",c,time);
			fprintf(outfile,"%s",c);
			fprintf(outfile,"time %f",time);
			exit(2);
		}
		time_arrival[num_in_q]=time;
	}else{
		delay=0.0;
		total_of_delays+=delay;
		
		++num_custs_delayed;
		server_status=BUSY;
		
		time_next_event[2]=time+expon(mean_service);
	}
}

void depart(void){
	int i;
	float delay;
	
	printf("subjek keluar sys : %d=\n",num_in_q);
	
	if(num_in_q==0){
		server_status=IDLE;
		time_next_event[2]=1.0e+30;
	}else{
		--num_in_q;
		delay=time-time_arrival[1];
		total_of_delays+=delay;
		
		++num_custs_delayed;
		time_next_event[2]=time+expon(mean_service);
		
		for (i = 0; i < num_in_q; i++){
			time_arrival[i]=time_arrival[i+1];
		}
	}
}

void report(void){
	fprintf(outfile,"\n\nAvg delay in queue %f11.3f\n\n",total_of_delays/num_custs_delayed);
	fprintf(outfile,"\n\nAvg number in queue %f11.3f\n\n",area_num_in_q/time);
	fprintf(outfile,"\n\nServer utilization %f15.3f\n\n",area_server_status/time);
	fprintf(outfile,"Time simulation ended %f12.3f\n\n",time);
}

float expon(float mean){
	float u;
	u=rand();
	return -mean*log(u);
}

void update_time_avg_stats(void){
	float time_since_last_event;
	
	time_since_last_event=time-time_last_event;
	time_last_event=time;
	
	area_num_in_q+=num_in_q*time_since_last_event;
	
	area_server_status+=server_status*time_since_last_event;
};



int main(){
	/*
	 *  
	 * main
	 * isi file mm1.in :
	 * mean_interarrival mean_service num_delays_required
	 * 
	 * */
	
	//file input
	infile=fopen("mm1.in","r");
	//file output
	outfile=fopen("mm1.out","w");
	
	num_events=2;
	
	fscanf(infile,"%f %f %d",&mean_interarrival,&mean_service,&num_delays_required);
	printf("mean_interarrival %f mean_service %f num_delays_required %d\n\n",mean_interarrival,mean_service,num_delays_required);
	
	//tulis ke mm1.out
	fprintf(outfile,"single server q sys \n\n");
	fprintf(outfile,"mean interarrival time %11.3f \n\n",mean_interarrival);
	fprintf(outfile,"mean svc time %16.3f minutes \n\n",mean_service);
	fprintf(outfile,"number of customers %14d \n\n",num_delays_required);
	
	//init the simulation
	//init variabel awal
	initialize();
	
	//float waktudelay=0.2;
	float waktudelay=0;
	int it=0;
	// ngulang sampe num_custs_delayed>num_delays_required
	while(num_custs_delayed<num_delays_required){
		printf("ulang %d \n",it);
		//determine next event
		timing();
		update_time_avg_stats();
		
		switch(next_event_type){
			case 1:arrive();break;
			case 2:depart();break;
		}

		printf("area_num_in_q %3.3f",area_num_in_q);printf("\n");
		printf("area_server_status %3.3f",area_server_status);printf("\n");
		printf("mean_interarrival %3.3f",mean_interarrival); printf("\n");
		printf("mean_service %3.3f",mean_service);printf("\n");
		printf("time %3.3f",time);printf("\n");
		printf("time_arrival[Q_LIMIT + 1] %3.3f",time_arrival[Q_LIMIT + 1]);printf("\n");
		printf("time_last_event %3.3f",time_last_event);printf("\n");
		printf("time_next_event[0] %3.3f",time_next_event[0]); printf("\n");
		printf("time_next_event[1] %3.3f",time_next_event[1]); printf("\n");
		printf("time_next_event[2] %3.3f",time_next_event[2]); printf("\n");
		printf("time_next_event[3] %3.3f",time_next_event[3]);printf("\n");
		printf("total_of_delays %3.3f",total_of_delays);printf("\n");
		printf("\n");
		
		if (waktudelay>0){
			sleep(waktudelay);
		}
		
		it++;
	}
	
	//invoke report
	report();
	
	
	fclose(infile);
	fclose(outfile);
	
	return 0;
}
