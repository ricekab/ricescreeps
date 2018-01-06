import os, sys, shutil

srcDir = "./dist/"
targetDir = "/path/to/screeps/scripts/127_0_0_1___21025/default/"

def main():
	if not os.path.isdir(targetDir):
		print("Target directory does not exists. Deploy aborted...")
		sys.exit(-1)
	for fname in os.listdir(srcDir):
		newFile = shutil.copy(srcDir + fname, targetDir)
		print("Copied file: " + newFile)
	print("Deployment successful!")

if __name__ == "__main__":
	main()