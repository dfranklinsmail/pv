
import os

# class will iterate over the 25pdb file and find a protein that is not
# in the given folder
class ProteinPicker():

    """
        Most proteins have a corrisponding fasta file url on the 
        site https://www.rcsb.org/ protein data bank.
        This method will find one protein in the 25pdb file that is
        not in the given folder path, and find its corrisponding url.
    """
    def nextProtein(path) :
        files = os.listdir(path)
        for file in files:
            print file
