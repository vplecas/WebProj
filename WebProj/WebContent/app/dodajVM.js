Vue.component("dodaj-vm" ,{
	data: function() {
		return {
			title: "Dodavanje Virtuelne masine",
			role: '',
			email: '',
			categories: null,
			organisations: null,
			VM: {},
			showErrorEmptyField: false,
			showErrorVMExists: false,
			canAddVM: false,
		}
	},
	template: 
	`
<div class="container bg-secondary">
	<div class="row justify-content-center">
		<div class="col-md-8">
			<div class="card">
				<div class="card-header">
					Register
				</div>
				<div class="card-body">

					<!-- input field for VM name -->
					<div class="input-group mb-4">
						<div class="input-group-prepend">
							<span class="input-group-text" id="inputGroup-sizing-default">VM name</span>
						</div>
						<input type="text" class="form-control" name="name" id="name" placeholder="Enter Name" v-model="VM.name"/>
					</div>

					<!-- input field for core number -->
					<div class="input-group mb-4">
						<div class="input-group-prepend">
							<span class="input-group-text" id="inputGroup-sizing-default">Number if cores</span>
						</div>
						<input type="number" min="1" class="form-control" name="coreNumber" id="coreNumber" placeholder="Enter coreNumber" v-model="VM.coreNumber"/>
					</div>

					<!-- input field for RAM -->
					<div class="input-group mb-4">
						<div class="input-group-prepend">
							<span class="input-group-text" id="inputGroup-sizing-default">RAM</span>
						</div>
						<input type="number" min="1" class="form-control" name="coreNumber" id="coreNumber" placeholder="Enter RAM" v-model="VM.ram"/>
					</div>

					<!-- input field for GPU -->
					<div class="input-group mb-4">
						<div class="input-group-prepend">
							<span class="input-group-text" id="inputGroup-sizing-default">GPU</span>
						</div>
						<input type="number" min="1" class="form-control" name="coreNumber" id="coreNumber" placeholder="Enter GPU" v-model="VM.gpu"/>
					</div>
					
					<!-- select category from drop down menu -->
					<div class="input-group mb-4">
						<div class="input-group-prepend">
							<span class="input-group-text" id="inputGroup-sizing-default">Categories</span>
						</div>
						<select class="custom-select" data-live-search="true" id="inputGroupSelect01" v-model="VM.vmCategory">
							<option selected>Choose...</option>
							<option v-for="m in categories" :value="m.ime">{{ m.ime }}</option>
						</select>
					</div>

					<!-- select organisation from drop down menu if superadmin role -->
					<div class="input-group mb-4" v-if="this.role == 'superadmin'">
						<div class="input-group-prepend">
							<span class="input-group-text" id="inputGroup-sizing-default">Organisations</span>
						</div>
						<select class="custom-select" data-live-search="true" id="inputGroupSelect02" v-model="VM.vmOrganisationName">
							<option selected>Choose...</option>
							<option v-for="m in organisations" :value="m.ime">{{ m.ime }}</option>
						</select>
					</div>
					
					<p class="errorMessageRegisterVM" v-if="this.showErrorEmptyField == true">Sva polja moraju biti popunjena !!!</br></p>
					<p class="errorMessageVMExists" v-if="this.showErrorVMExists == true">VM sa tim imenom vec postoji !!!</br></p>
					
					<div class="form-group ">
						<button type="button" class="btn btn-primary btn-lg btn-block login-button" v-on:click="emptyField(); VMAlreadyExists();">Add new Virtual Machine</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
	`,
	methods: {
		//Proveriti da li radi: v-if="this.role == 'superadmin'"
		/**
		 * Load all categories, no matter of user's role.
		 */
		loadCategories: function() {
			axios
			.post("rest/categoryService/getAllCategories")
			.then(response => {
				this.categories = response.data;
			});
		},
		/**
		 * If user is admin, he can choose just disks from his organisation.
		 * super admin get disks from all organisations to choose.
		 */
		loadOrganisations: function() {
			
		},
		emptyField: function() {
			this.showErrorEmptyField = false;
			this.showErrorVMExists = false;
			this.canAddVM = false;
			
			console.log("Printujemo sve");
			console.log(this.VM.name);
			console.log(this.VM.coreNumber);
			console.log(this.VM.vmOrganisationName);
			
			if((this.VM.name !== '' && this.VM.name != undefined) && 
			(this.VM.coreNumber !== '' && this.VM.coreNumber != undefined && this.VM.coreNumber > 0) &&
			(this.VM.ram !== '' && this.VM.ram != undefined && this.VM.ram > 0) &&
			(this.VM.gpu !== '' && this.VM.gpu != undefined && this.VM.gpu > 0) &&
			(this.VM.vmOrganisationName !== '' && this.VM.vmOrganisationName != undefined && this.VM.vmOrganisationName !== 'Choose...') &&
			(this.VM.type !== '' && this.VM.type != undefined && this.VM.type !== 'Choose...')) 
			{
				if (this.role == "superadmin" && this.VM.vmOrganisationName !== '' && this.VM.vmOrganisationName != undefined && this.VM.vmOrganisationName !== 'Choose...') {
					this.showErrorEmptyField = false;
					console.log("Sva polja su popunjena.");
				}else {
					console.log("Nije popunjeno polje za organizacije.");
					this.showErrorEmptyField = true;
				}
			}else{
				console.log("Nisu sva polja popunjena.");
				this.showErrorEmptyField = true;
			}
		},
		VMAlreadyExists: function() {
			if (this.showErrorEmptyField == false) {
				
				var path = "rest/VMService/checkIfVMExist/" + this.VM.name;
				
				axios
				.get(path)
				.then(response => {
					if (response.data == false || response.data == 'false') {
						this.canAddVM = true;
						console.log("Dodajemo novu virtuelnu masinu.");
						this.addVM.call();
					}
				});
			}
		},
		addVM: function() {
			console.log("Dosli smo i dovde: " + this.canAddVM );
			if (this.canAddVM == true || this.canAddVM === true) {

				console.log(this.VM.name);
				console.log(this.VM.capacity);
				console.log(this.VM.vmOrganisationName);
				console.log(this.VM.type);
				
				/**
				 * Admin cannot choose organisation, 
				 * he can choose disks just from his organissations.
				 */
				if (this.role == "admin") {
					axios
					.post('rest/userService/getUserOrganisationName', {"role": this.role, "email": this.email})
					.then(response => {
						console.log("naziv organizacije admina: " + response.data);
						this.VM.vmOrganisationName = response.data;
					});
				}
				
				axios
            	.post('rest/VMService/addVM', {"name": this.VM.name, "coreNumber": this.VM.coreNumber, "ram": this.VM.ram, "gpu": this.VM.gpu, "categoryName": this.VM.vmCategory, "organisationName": this.VM.vmOrganisationName})
            	.then(response => {
            		var VMSuccesfullyRegistered = response.data;
            		console.log("VM uspesno upisan? : " + VMSuccesfullyRegistered);
            		
            		if(VMSuccesfullyRegistered){
            			console.log("VM je uspesno upisana.");
            			router.push({path: "/pregledVM"}); // Bring user back to pregledVM
            		}else{
            			console.log("VM nije upisana.");
            		}
            	});
			}
		},
	},
	mounted () {  //created 
		this.role = localStorage.getItem('role');
		this.email = localStorage.getItem('email');
		this.loadCategories();
		this.loadOrganisations();
		
//		axios
//		.post('rest/overview/getAllVM', {"role": this.role, "email": this.email})
//		.then(response => {
//			this.machines = response.data;
//    	});
    },
});