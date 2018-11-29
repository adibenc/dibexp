#!/bin/python3

# run 
# $ python3 vp1.py

# simulasi vispem
# antrian samsat alun2 malang
# basis : mcgrawhill simulation modeling & analysis

import random
import math
import time

class Simulasi:
	# var global
	# hati2 dengan scope
	
	debug=True
	
	# constant
	Q_LIMIT=100
	BUSY=1
	IDLE=0
	
	# int
	next_event_type=0
	num_custs_delayed=0
	num_events=0
	num_in_q=0
	server_status=0
	
	# float
	area_num_in_q=0
	area_server_status=0 
	mean_interarrival=0
	mean_service=0
	time=1
	time_arrival=[0 for i in range(Q_LIMIT)]
	time_last_event=0
	time_next_event=[0 for i in range(4)]
	total_of_delays=0
	
	def __init__(self,debug=False):
		self.debug=debug
		print("Sim")
	
	def initialize(self):
		self.time=0.0
		# print("stime",self.time)
		self.server_status=self.IDLE
		self.num_in_q=0
		self.time_last_event=0.0
	
		self.num_custs_delayed=0
		self.total_of_delays=0.0
		self.area_num_in_q=0
		self.area_server_status=0
		
		self.time_next_event[1]=self.time+self.expon(self.mean_interarrival)
		self.time_next_event[2]=1.0e+30
		# self.time_next_event[2]=1.0e+4
		
		pass
		
	def timing(self):
		# local
		# randomize di sini / gimana?
		
		min_time_next_event=1.0e+29
		# min_time_next_event=1.0e+3;
		
		self.next_event_type=0
		
		# for(i=1;i<=num_events;++i){
			# if(time_next_event[i]<min_time_next_event){
				# min_time_next_event=time_next_event[i];
				# next_event_type=i;
			# }
		# }
		
		for i in range(1,self.num_events+1):
			if self.time_next_event[i]<min_time_next_event:
				min_time_next_event=self.time_next_event[i]
				self.next_event_type=i
		
		
		# if(next_event_type==0){
			# fprintf(outfile,"\nEvent list empty at time %f",time);
			# exit(1);
		# }
		
		print ("self.next_event_type",self.next_event_type)
		
		if self.next_event_type==0:
			print("\nEvent list empty at time %f"%self.time)
			exit(1)
			
		self.time=min_time_next_event
		
		pass
		
	def arrive(self):
		# local
		delay=0
		self.time_next_event[1]=self.time+self.expon(self.mean_interarrival)
		print('\\'*20)
		print('/'*20,'\n')
		print("subjek masuk sys : q=%d\n"%self.num_in_q)
		
		if self.server_status==self.BUSY:
			self.num_in_q+=1
			if self.num_in_q>self.Q_LIMIT:
				# kalo antriannya overflow, simulasi berhenti
				print("arr : overflow arr timearr at time %f"%self.time)
				exit(2)
			
			self.time_arrival[self.num_in_q]=self.time
		else:
			self.delay=0.0
			self.total_of_delays+=self.delay
			
			self.num_custs_delayed+=1
			self.server_status=self.BUSY
			
			self.time_next_event[2]=self.time+self.expon(self.mean_service)
		
	def depart(self):
		# int i;
		delay=0
		print('/'*20)
		print('\\'*20)
		print("subjek keluar sys : q=%d\n"%self.num_in_q)
		
		if self.num_in_q==0:
			self.server_status=self.IDLE
			self.time_next_event[2]=1.0e+30
		else:
			self.num_in_q-=1;
			delay=self.time-self.time_arrival[1]
			self.total_of_delays+=self.delay
			
			self.num_custs_delayed+=1
			self.time_next_event[2]=self.time+self.expon(self.mean_service)
			
			for i in range(self.num_in_q):
				self.time_arrival[i]=self.time_arrival[i+1]

	def report(self):
		print("\n\nAvg delay in queue %11.3f\n\n"%(self.total_of_delays/self.num_custs_delayed))
		print("\n\nAvg number in queue %11.3f\n\n"%(self.area_num_in_q/self.time))
		print("\n\nServer utilization %15.3f\n\n"%(self.area_server_status/self.time))
		print("Time simulation ended %12.3f\n\n"%self.time)
		
	def update_time_avg_stats(self):
		time_since_last_event=self.time-self.time_last_event
		self.time_last_event=self.time
		
		self.area_num_in_q+=self.num_in_q*time_since_last_event
		
		self.area_server_status+=self.server_status*time_since_last_event
		
	def expon(self,mean=0):
		# gen random float
		u=random.random()
		return -mean*math.log(u)
		
	def visualize(self):
		print("visual")
		o1=" _O_"
		o2="  | "
		o3=" / \\"
		if self.num_in_q>0:
			print(o1*self.num_in_q)
			print(o2*self.num_in_q)
			print(o3*self.num_in_q)
		print()
		# print(orang+orang)

# input list : [mean_interarrival,mean_service,num_delays_required]
	def simulate(self,input1=[1,1,1]):
		# simulasikan :)
		print("simulate")
		
		self.mean_interarrival,self.mean_service,self.num_delays_required=input1[0],input1[1],input1[2]
		
		self.num_events=2
		print("mean_interarrival %f mean_service %f num_delays_required %d"%(self.mean_interarrival,self.mean_service,self.num_delays_required))
		print("single server q sys")
		print("mean interarrival time %11.3f"%self.mean_interarrival)
		print("mean svc time %16.3f minutes"%self.mean_service)
		print("number of customers %14d"%self.num_delays_required)
		
		self.initialize()
		
		waktudelay=1
		it=0
		
		while self.num_custs_delayed<self.num_delays_required :
			print("\n\nulang %d \n"%it)
			# determine next event
			self.visualize()
			self.timing()
			self.update_time_avg_stats()
			
			if self.next_event_type==1:
				self.arrive()
			elif self.next_event_type==2:
				self.depart()

			if self.debug:
				print("area_num_in_q %3.3f"%self.area_num_in_q)
				print("area_server_status %3.3f"%self.area_server_status)
				print("mean_interarrival %3.3f"%self.mean_interarrival)
				print("mean_service %3.3f"%self.mean_service)
				print("time %3.3f"%self.time)
				# print("time_arrival[Q_LIMIT + 1] %3.3f\n"%time_arrival[Q_LIMIT + 1])
				print("time_last_event %3.3f"%self.time_last_event)
				print("time_next_event[0] %3.3f"%self.time_next_event[0])
				print("time_next_event[1] %3.3f"%self.time_next_event[1])
				print("time_next_event[2] %3.3f"%self.time_next_event[2])
				print("time_next_event[3] %3.3f"%self.time_next_event[3])
				print("total_of_delays %3.3f"%self.total_of_delays)
				print("\n")
			
			if waktudelay>0:
				time.sleep(waktudelay)
			
			it+=1
			# endwhile
		# doubletab
		self.report()

def main():
	# s=Simulasi(debug=True)
	s=Simulasi()
	# simulate input list : 
	# [mean_interarrival,mean_service,
	# num_delays_required]	
	# input1=[2,2,2]
	input1=[10,10,10]
	s.simulate(input1)

# call main
main()
