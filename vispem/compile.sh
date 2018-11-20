#!/bin/sh
#run di ubuntu
#script input + compile linux + run program
#run -> ./compile.sh

#compile
gcc basicsim1.c -o basicsim1 -lm
#input
#mean_interarrival mean_service num_delays_required

#echo 2 2 2 > mm1.in
#echo 2 2 2 > mm1.in
#echo 2 2 2 > mm1.in
echo 1 3 7 > mm1.in
echo
#run binary
./basicsim1
echo
echo mm1.in
cat mm1.in
echo
echo mm1.out\n
cat mm1.out
echo \n
